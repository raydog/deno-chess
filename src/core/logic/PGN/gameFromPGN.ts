import { Board } from "../../datatypes/Board.ts";
import { ChessParseError } from "../../datatypes/ChessError.ts";
import { Color } from "../../datatypes/Color.ts";
import {
  GAMESTATUS_ACTIVE,
  GAMESTATUS_DRAW,
  GAMESTATUS_DRAW_STALEMATE,
  GAMESTATUS_RESIGNED,
} from "../../datatypes/GameStatus.ts";
import { Move } from "../../datatypes/Move.ts";
import { buildStandardBoard } from "../boardLayouts/standard.ts";
import { boardFromFEN } from "../FEN/boardFromFEN.ts";
import { findMoveBySAN } from "../findMoveBySAN.ts";
import { listAllValidMoves } from "../listValidMoves.ts";
import { checkMoveResults } from "../moveResults.ts";
import { performMove } from "../performMove.ts";
import { validatePGNKeyValue } from "./pgnUtils.ts";

/**
 * PGN file parsing can be customized with a few options.
 */
export interface PgnParseOpts {
  verifyTags: boolean;
}

// Output from the Lexer: (Defined by PGN spec, section 7)
// Note: < > omitted as they don't have meaning yet
// Todo: Commentary ("{ text }" and "; text \n") is currently treated the same as full comments (%...). At some point,
//       support bringing in the commentary...
type Token =
  | TokenSpecialChar
  | TokenString
  | TokenInteger
  | TokenSymbol
  | TokenNag;
type TokenSpecialChar = { type: "[" | "]" | "(" | ")" | "." | "*" };
type TokenString = { type: "Str"; value: string };
type TokenInteger = { type: "Int"; value: number };
type TokenSymbol = { type: "Sym"; value: string };
type TokenNag = { type: "Nag"; value: number };

export type PgnOutput = {
  board: Board;
  moves: PgnMove[];
  tags: { [key: string]: string };
  winner: "white" | "black" | "draw" | null;
};

export type PgnMove = {
  num: number;
  turn: Color;
  move: Move;
  san: string;
};

type Tags = { [key: string]: string };

const WS_RE = /^\s/;
const CHAR_TOKENS_RE = /^[\[\]().*]/;
const DIGIT_RE = /^\d/;
const SYMBOL_START_RE = /^[a-z0-9]/i;
const SYMBOL_CONTINUE_RE = /^[-a-z0-9_+#=:/]/i; // Aside: spec actually forgot / as a symbol continuation character, even though the spec depends on it.
const IS_INT_RE = /^\d+$/;
const GAME_TERM_RE = /^(1-0|0-1|1\/2-1\/2)$/;

/**
 * Parses a PGN string, and returns the details necessary to fully bootstrap a ChessGame based on it.
 */
export function gameFromPGN(pgn: string): PgnOutput {
  const tokens = _lexer(pgn);
  const tags: Tags = {};
  const moves: PgnMove[] = [];

  // Consume all PGN tags.
  while (tokens[0]?.type === "[") {
    _parseTag(tokens, tags);
  }

  // Now that we have the tags. Init the board to either the optional FEN starting pos, or just the standard setup:
  const board = (tags.FEN) ? boardFromFEN(tags.FEN) : buildStandardBoard();

  // Consume all moves. Moves *MUST* be valid:
  _parseMoveList(tokens, board, moves);

  // Last token describes the game status:
  const ending = _parseEndOfGame(tokens, board);

  if (tags.Result && ending !== tags.Result) {
    throw new ChessParseError("PGN Result tag has an incorrect game status");
  }

  // Done. Return all the things:
  return { board, tags, moves, winner: _winnerString(ending) };
}

function _parseTag(tokens: Token[], tags: Tags) {
  const lbrack = tokens.shift() as TokenSpecialChar;
  _expectToken(lbrack, "[");

  const key = tokens.shift() as TokenSymbol;
  _expectToken(key, "Sym");

  const val = tokens.shift() as TokenString;
  _expectToken(val, "Str");

  const rbrack = tokens.shift() as TokenSpecialChar;
  _expectToken(rbrack, "]");

  validatePGNKeyValue(key.value, val.value);

  if (tags[key.value]) {
    throw new ChessParseError("Duplicate PGN tag: " + key.value);
  }

  tags[key.value] = val.value;
}

function _parseMoveList(tokens: Token[], board: Board, moves: PgnMove[]) {
  while (true) {
    const tok = tokens.shift();
    if (!tok) {
      throw new ChessParseError(`PGN move list didn't have a conclusion`);
    }
    // Ints are move number asserts:
    if (tok.type === "Int") {
      if (board.current.moveNum !== tok.value) {
        throw new ChessParseError(
          `PGN move list expected it to be turn ${tok.value}, but the board is on ${board.current.moveNum}'`,
        );
      }
      continue;
    }

    // Dots are ignored:
    if (tok.type === ".") {
      continue;
    }

    // Ignore NAGs for now:
    if (tok.type === "Nag") {
      continue;
    }

    // * is a game termination marker:
    if (tok.type === "*") {
      tokens.unshift(tok);
      break;
    }

    // Hypothetical movesets aren't supported, so skip them:
    if (tok.type === "(") {
      let stackDepth = 1;
      while (stackDepth) {
        const tok = tokens.shift();
        if (!tok) {
          throw new ChessParseError(`PGN move list didn't have a conclusion`);
        }
        if (tok.type === "(") {
          stackDepth++;
        } else if (tok.type === ")") {
          stackDepth--;
        }
      }
      continue;
    }

    // Symbols are either win / loss / draw notifications, or SAN moves:
    if (tok.type === "Sym") {
      // Game termination markers indicate the end of the move list:
      if (GAME_TERM_RE.test(tok.value)) {
        tokens.unshift(tok);
        break;
      }

      // Else, possibly a move.
      _doMove(board, moves, tok.value);
      continue;
    }

    // Else, unexpected symbol:
    throw new ChessParseError(
      `PGN data had unexpected data in the move list: ${_describeToken(tok)}`,
    );
  }
}

function _parseEndOfGame(tokens: Token[], board: Board): string {
  const end = tokens.shift();
  if (!end) {
    throw new ChessParseError(`PGN move list didn't have a conclusion`);
  }
  if (tokens.length) {
    throw new ChessParseError(`PGN had extra moves after game ended`);
  }

  if (end.type === "*") {
    // Game should still be active:
    return "*";
  }

  _expectToken(end, "Sym");

  const sym = end as TokenSymbol;
  switch (sym.value) {
    // Either white or black won. Either way, the board status should be in checkmate. If it's active, then
    // we'll call it a resignation:
    case "1-0":
    case "0-1":
      if (board.current.status === GAMESTATUS_ACTIVE) {
        board.current.status = GAMESTATUS_RESIGNED;
      }
      return sym.value;

    // Draw. Pull a good reason from the move result object, and move on:

    case "1/2-1/2": {
      const res = checkMoveResults(board, 1 - board.current.turn);
      board.current.status = (res.newGameStatus >= GAMESTATUS_DRAW)
        ? res.newGameStatus
        : GAMESTATUS_DRAW;
      return sym.value;
    }

    default:
      throw new ChessParseError(`PGN had an unexpected game end: ${sym.value}`);
  }
}

// Do the given move. However, we're a WEE bit more permissive about draw conditions, because people in a game could
// have elected to not stop:
function _doMove(board: Board, moves: PgnMove[], san: string) {
  const turn = board.current.turn;
  const allMoves = listAllValidMoves(board, turn);
  const move = findMoveBySAN(allMoves, san);
  moves.push({
    num: board.current.moveNum,
    turn: board.current.turn,
    move,
    san,
  });
  performMove(board, move);
  const res = checkMoveResults(board, turn);
  board.current.turn = 1 - turn;
  // We'll accept active, checkmated, or stalemated status, but not the others. (Yet)
  if (
    res.newGameStatus < GAMESTATUS_DRAW ||
    res.newGameStatus === GAMESTATUS_DRAW_STALEMATE
  ) {
    board.current.status = res.newGameStatus;
  }
}

function _winnerString(status: string): "white" | "black" | "draw" | null {
  switch (status) {
    case "1-0":
      return "white";
    case "0-1":
      return "black";
    case "1/2-1/2":
      return "draw";
    default:
      return null;
  }
}

// Note: exported only for unit tests:
export function _lexer(pgn: string): Token[] {
  let idx = 0;
  const len = pgn.length;
  const out: Token[] = [];

  // Track when we're on a new line, since some comments are only valid when started here...
  let lineStartIdx = 0;

  while (idx < len) {
    const first = pgn[idx];

    // Ignore whitespace:
    if (WS_RE.test(first)) {
      idx++;
      if (first === "\n") {
        lineStartIdx = idx;
      }
      continue;
    }

    // % comments:
    if ((idx === lineStartIdx) && first === "%") {
      while (idx < len && pgn[++idx] !== "\n");
      continue;
    }

    // ; commentary:
    if (first === ";") {
      while (idx < len && pgn[++idx] !== "\n");
      continue;
    }

    // { commentary }:
    if (first === "{") {
      while (idx < len && pgn[++idx] !== "}");
      idx++;
      continue;
    }

    // Special single-character tokens:
    if (CHAR_TOKENS_RE.test(first)) {
      idx++;
      out.push({ type: first } as TokenSpecialChar);
      continue;
    }

    // Quoted strings:
    if (first === '"') {
      let str = "";
      while (true) {
        const char = pgn[++idx];
        if (idx >= len) {
          throw new ChessParseError(
            `Invalid PGN: String reached the end without being closed.`,
          );
        }
        if (char === '"') {
          idx++;
          break;
        }
        if (char === "\\") {
          const next = pgn[++idx];
          if (idx >= len) {
            throw new ChessParseError(
              `Invalid PGN: String reached the end without being closed.`,
            );
          } else if (next === '"' || next === "\\") {
            str += next;
          } else {
            throw new ChessParseError(
              `Invalid PGN string escape: '\\${next}'. Can only be '\\\\' or '\\"'.`,
            );
          }
          continue;
        }
        // Spec insists that we only allow printable characters. For ASCII, that's 32 through 126.
        const code = char.charCodeAt(0);
        if (code < 32 || code > 126) {
          throw new ChessParseError(
            `PGN strings can only contain printable ASCII characters.`,
          );
        }
        // Else, fine:
        str += char;
      }
      // Spec says these are invalid:
      if (str.length >= 256) {
        throw new ChessParseError(
          `PGN strings must be at most 255 characters long.`,
        );
      }
      out.push({ type: "Str", value: str });
      continue;
    }

    // NAGs:
    if (first === "$") {
      let digits = "";
      while (idx < len) {
        const char = pgn[++idx];
        if (!DIGIT_RE.test(char)) {
          break;
        }
        digits += char;
      }
      if (!digits) {
        throw new ChessParseError(
          `PGN $ characters must be followed by a digit`,
        );
      }
      out.push({ type: "Nag", value: parseInt(digits, 10) });
      continue;
    }

    // Symbols (and their variants)
    if (SYMBOL_START_RE.test(first)) {
      let sym = first;
      while (idx < len) {
        const char = pgn[++idx];
        if (idx >= len || !SYMBOL_CONTINUE_RE.test(char)) {
          break;
        }
        sym += char;
      }

      // Return early if int:
      if (IS_INT_RE.test(sym)) {
        out.push({ type: "Int", value: parseInt(sym, 10) });
        continue;
      }

      // Final hack: Section 8.2.3.8 allows for move suffixes, but only if they're the last part of a move symbol.
      // Allow for that:
      for (let i = 0; i < 2; i++) {
        const char = pgn[idx];
        if (char !== "!" && char !== "?") {
          break;
        }
        sym += char;
        idx++;
      }

      if (sym.length >= 256) {
        throw new ChessParseError(
          `PGN symbols must be at most 255 characters long.`,
        );
      }

      out.push({ type: "Sym", value: sym });
      continue;
    }

    // Else, unknown character:
    throw new ChessParseError(
      `PGN has invalid character: ${first} at ${pgn.slice(idx - 20, idx + 20)}`,
    );
  }

  return out;
}

function _expectToken(tok: Token | undefined, shouldBe: Token["type"]) {
  if (!tok || tok.type !== shouldBe) {
    new ChessParseError(
      `Expected a '${shouldBe}' token, but got ${_describeToken(tok)}.`,
    );
  }
}

function _describeToken(tok: Token | undefined): string {
  if (!tok) return "the end-of-file";
  switch (tok.type) {
    case "[":
    case "]":
    case "(":
    case ")":
    case ".":
    case "*":
      return `a '${tok.type}`;
    case "Int":
      return `the Integer '${tok.value}'`;
    case "Str":
      return `the String '${tok.value}'`;
    case "Sym":
      return `the Symbol '${tok.value}'`;
    case "Nag":
      return `the NAG Code $${tok.value}`;
    default:
      return `the unknown symbol: ${JSON.stringify(tok)}`;
  }
}
