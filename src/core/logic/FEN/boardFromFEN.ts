import { Board } from "../../datatypes/Board.ts";
import { buildCastleMap, CastleMap } from "../../datatypes/CastleMap.ts";
import { ChessParseError } from "../../datatypes/ChessError.ts";
import { Color, COLOR_BLACK, COLOR_WHITE } from "../../datatypes/Color.ts";
import { coordFromAN } from "../../datatypes/Coord.ts";
import {
  PieceType,
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../../datatypes/PieceType.ts";
import { encodePieceSpace, Space, SPACE_EMPTY } from "../../datatypes/Space.ts";
import { checkMoveResults } from "../moveResults.ts";

const DIGIT_RE = /[1-8]/;
const WHITE_PIECE_RE = /[PBNRQK]/;
const BLACK_PIECE_RE = /[pbnrqk]/;

const FEN_RE =
  /^((?:[pbnrqkPBNRQK1-8]{1,8}\/){7}[pbnrqkPBNRQK1-8]{1,8})\s+([wb])\s+(K?Q?k?q?|-)\s+([a-h][36]|-)\s+(\d+)\s+(\d+)$/;

/**
 * Builds a new Board from a FEN string.
 *
 * @param fen The FEN string
 * @param board An existing board to reuse, if we're avoiding allocations
 */
export function boardFromFEN(fen: string, board?: Board): Board {
  if (board) board.reset();

  const out = board || new Board();

  fen = fen.trim();
  const match = fen.match(FEN_RE);
  if (!match) {
    throw new ChessParseError("Bad FEN string");
  }

  // Field 1: Board layout
  const ranks = match[1].split("/");

  for (let rank = 7; rank >= 0; rank--) {
    let dataIdx = 0;
    const data = ranks[7 - rank];
    for (let file = 0; file < 8; file++) {
      const idx = (rank << 4) | file;
      if (dataIdx >= data.length) {
        throw new ChessParseError(
          `Bad FEN string: Rank ${rank + 1} had less than 8 files`,
        );
      }
      const ch = data[dataIdx++];
      if (DIGIT_RE.test(ch)) {
        const num = parseInt(ch, 10);
        for (let n = 0; n < num; n++) {
          out.set(idx + n, SPACE_EMPTY);
        }
        file += num - 1;
      } else if (WHITE_PIECE_RE.test(ch)) {
        const type = _getPieceType(ch);
        out.set(idx, _spaceBuilder(COLOR_WHITE, type, rank));
      } else if (BLACK_PIECE_RE.test(ch)) {
        const type = _getPieceType(ch);
        out.set(idx, _spaceBuilder(COLOR_BLACK, type, rank));
      }
    }
  }

  // Field 2: Turn
  const turn = _parseTurn(match[2]);
  out.current.turn = turn;

  // Field 3: Castle availability
  out.current.castles = _parseCastles(match[3]);

  // Field 4: En Passant target
  if (match[4] !== "-") {
    out.current.ep = coordFromAN(match[4]);
  }

  // Field 5: Half-move clock
  out.current.clock = parseInt(match[5], 10);

  // Field 6: Full-move number
  out.current.moveNum = parseInt(match[6], 10);

  const status = checkMoveResults(out, 8 - turn);
  out.current.status = status.newGameStatus;

  return out;
}

const TYPES: { [fen: string]: PieceType } = {
  p: PIECETYPE_PAWN,
  b: PIECETYPE_BISHOP,
  n: PIECETYPE_KNIGHT,
  r: PIECETYPE_ROOK,
  q: PIECETYPE_QUEEN,
  k: PIECETYPE_KING,
};

function _getPieceType(fen: string): PieceType {
  return TYPES[fen.toLowerCase()];
}

const TURNS: { [fen: string]: Color } = {
  w: COLOR_WHITE,
  b: COLOR_BLACK,
};

function _parseTurn(fen: string): Color {
  return TURNS[fen];
}

// Assumes that rooks are on the standard starting files, but that's just how it is with FEN:
function _parseCastles(fen: string): CastleMap {
  let wQueen = 0x88, wKing = 0x88, bQueen = 0x88, bKing = 0x88;
  if (fen !== "-") {
    for (let i = 0; i < fen.length; i++) {
      switch (fen[i]) {
        case "K":
          wKing = 0x07;
          break;
        case "Q":
          wQueen = 0x00;
          break;
        case "k":
          bKing = 0x77;
          break;
        case "q":
          bQueen = 0x70;
          break;
      }
    }
  }
  return buildCastleMap(wQueen, wKing, bQueen, bKing);
}

function _spaceBuilder(color: Color, type: PieceType, rank: number): Space {
  // HasMoved needs to be accurate for pawns, since it governs their ability to double-open:
  if (type === PIECETYPE_PAWN) {
    const onStart = (rank === 1 && color === COLOR_WHITE) ||
      (rank === 6 && color === COLOR_BLACK);
    return encodePieceSpace(type, color, !onStart);
  }
  // Else, we don't REALLY care, so just say they haven't moved. Why not?
  return encodePieceSpace(type, color, false);
}
