// Note: the class in this file serves as the external API.

import { boardRenderASCII } from "../core/logic/boardRenderASCII.ts";
import { boardToFEN } from "../core/logic/FEN/boardToFEN.ts";
import { buildStandardBoard } from "../core/logic/boardLayouts/buildStandardBoard.ts";
import {
  listAllValidMoves,
  listValidMoves,
} from "../core/logic/listValidMoves.ts";
import { Board } from "../core/datatypes/Board.ts";
import { ChessBadInput, ChessGameOver } from "../core/datatypes/ChessError.ts";
import { COLOR_WHITE } from "../core/datatypes/Color.ts";
import { coordFromAN, coordToAN } from "../core/datatypes/Coord.ts";
import {
  GameStatus,
  GAMESTATUS_ACTIVE,
  GAMESTATUS_CHECKMATE,
  GAMESTATUS_DRAW,
  GAMESTATUS_DRAW_FIFTYMOVES,
  GAMESTATUS_DRAW_NOMATERIAL,
  GAMESTATUS_DRAW_REPETITION,
  GAMESTATUS_DRAW_STALEMATE,
  GAMESTATUS_RESIGNED,
} from "../core/datatypes/GameStatus.ts";
import { SPACE_EMPTY, spaceGetColor } from "../core/datatypes/Space.ts";
import { boardFromFEN } from "../core/logic/FEN/boardFromFEN.ts";
import { doGameMove } from "./doGameMove.ts";
import { GameMove, GameMoveInternal } from "./GameMove.ts";
import { gameFromPGN } from "../core/logic/PGN/gameFromPGN.ts";
import { gameToPGN } from "../core/logic/PGN/gameToPGN.ts";
import { validatePGNKeyValue } from "../core/logic/PGN/pgnUtils.ts";

/**
 * The current game status.
 */
export interface Status {
  /**
   * What's the game situation? Either "active" or some manner of game-over.
   */
  state:
    | "active"
    | "checkmate"
    | "resigned"
    | "draw-other"
    | "draw-stalemate"
    | "draw-repetition"
    | "draw-fifty-moves"
    | "draw-no-material";

  /**
   * The color who is to play.
   *
   * Note: In endgame situations, this is the player who is IN the situation. So, for example, when "checkmate", this is
   * the player who is currently checked, and has no available move. So the winner would be the OTHER player.
   */
  turn: "white" | "black";

  /**
   * If the game is over, this property will be set, and will describe who won the game.
   */
  winner?: "white" | "black" | "draw";

  /**
   * If this game was ended for a non-standard reason (either with a draw or a resignation,) this property could be
   * included to explain the situation.
   */
  reason?: string;
}

/**
 * Details on an available move.
 */
interface MoveDetails {
  /**
   * The departing square, in algebraic notation.
   */
  from: string;

  /**
   * The destination square, in algebraic notation.
   */
  dest: string;

  /**
   * True if this move represents a pawn reaching its final rank, and so the promotion parameter will be required when
   * performing the move.
   */
  promotion: boolean;
}

/**
 * Settings for exporting a ChessGame in PGN format.
 */
interface PGNOptions {
  /**
   * Custom PGN tags.
   *
   * - Each tag name must start with an uppercase letter (A-Z), and can only contain letters, numbers, and underscores.
   * - Each value must only contain printable ASCII values.
   */
  tags?: { [name: string]: string };
}

// Map used to convert internal status into external ones:
const GAMESTATUS_MAP: { [status in GameStatus]: Status["state"] } = {
  [GAMESTATUS_ACTIVE]: "active",
  [GAMESTATUS_CHECKMATE]: "checkmate",
  [GAMESTATUS_RESIGNED]: "resigned",
  [GAMESTATUS_DRAW]: "draw-other",
  [GAMESTATUS_DRAW_STALEMATE]: "draw-stalemate",
  [GAMESTATUS_DRAW_REPETITION]: "draw-repetition",
  [GAMESTATUS_DRAW_FIFTYMOVES]: "draw-fifty-moves",
  [GAMESTATUS_DRAW_NOMATERIAL]: "draw-no-material",
};

/**
 * A single chess game.
 */
export class ChessGame {
  #board: Board;
  #moves: GameMoveInternal[] = [];

  #gameWinner: "white" | "black" | "draw" | null = null;
  #drawReason: string | null = null;

  #tags: { [name: string]: string } = {};

  private constructor(b: Board) {
    this.#board = b;
    this.setTag("Date", new Date());
  }

  /**
   * Start a brand new chess game. The board is set up in the standard way, and it is White's turn to play.
   *
   * @returns The new ChessGame.
   */
  public static NewStandardGame(): ChessGame {
    return new ChessGame(buildStandardBoard());
  }

  /**
   * Start a new chess game, using the input FEN string as the starting state.
   *
   * @param fen The starting state, in FEN format.
   * @returns The new ChessGame.
   */
  public static NewFromFEN(fen: string): ChessGame {
    const game = new ChessGame(boardFromFEN(fen));
    game.maybeRefreshWinner();
    game.setTag("SetUp", true);
    game.setTag("FEN", fen);
    return game;
  }

  /**
   * Start a new chess game, using the PGN game provided as a starting state.
   *
   * @param pgn The starting state, in PGN format.
   * @returns The new ChessGame.
   */
  public static NewFromPGN(pgn: string): ChessGame {
    const data = gameFromPGN(pgn);
    const game = new ChessGame(data.board);
    game.#tags = data.tags;
    game.#moves.push(...data.moves.map((move): GameMoveInternal => {
      return {
        num: move.num,
        side: (move.turn === COLOR_WHITE) ? "white" : "black",
        from: coordToAN(move.move.from),
        dest: coordToAN(move.move.dest),
        san: move.san,
        move: move.move,
      };
    }));
    if (data.winner) {
      game.#gameWinner = data.winner;
    }
    return game;
  }

  /**
   * Return all PGN tags that we currently have stored for this game.
   *
   * @returns
   */
  getTags(): { [name: string]: string } {
    return { ...this.#tags };
  }

  /**
   * Will set a single tag value for this game. This doesn't have any bearing on how the game will run, but these values
   * will be used when generating a PGN file.
   *
   * Name must start with an Uppercase letter, and only contain letters (a-z), digits (0-9), and underscores (_). This
   * is to remain consistent with the PGN standard.
   *
   * If value is null, the prior tag value will be unset. If the value is a string or number, the value will simply
   * be coerced to string. Boolean values are coerced to "1" or "0". Date values are coerced to "YYYY.MM.DD" format.
   * Values must contain only printable ASCII values.
   *
   * @param name The tag name.
   * @param value The tag value. (null if we wish to erase a prior value.)
   */
  setTag(name: string, value: null | string | boolean | number | Date) {
    // Special case for key deletion:
    if (value == null) {
      validatePGNKeyValue(name, "");
      delete this.#tags[name];
      return;
    }

    // Else, coerce to string:
    let valueStr: string;
    if (typeof value === "boolean") {
      valueStr = value ? "1" : "0";
    } else if (value instanceof Date) {
      valueStr = (isNaN(value.valueOf())) ? "????.??.??" : [
        value.getFullYear(),
        String(value.getMonth() + 1).padStart(2, "0"),
        String(value.getDate()).padStart(2, "0"),
      ].join(".");
    } else {
      valueStr = String(value);
    }

    validatePGNKeyValue(name, valueStr);
    this.#tags[name] = valueStr;
  }

  /**
   * Return a list of all turns in the game.
   *
   * @returns
   */
  history(): GameMove[] {
    // Duplicate the structs, so client-side fiddling doesn't muck things up:
    return this.#moves.map((move) => ({
      num: move.num,
      side: move.side,
      from: move.from,
      dest: move.dest,
      san: move.san,
    }));
  }

  /**
   * What's the game's status? Details the turn (if active), the winner (if checkmate), or the terminal state, if the
   * game was drawn for some reason.
   *
   * @returns A status string.
   */
  getStatus(): Status {
    const current = this.#board.current;
    const out: Status = {
      state: GAMESTATUS_MAP[current.status],
      turn: (current.turn === COLOR_WHITE) ? "white" : "black",
    };
    if (this.#gameWinner) {
      out.winner = this.#gameWinner;
    }
    if (this.#drawReason) {
      out.reason = this.#drawReason;
    }
    return out;
  }

  /**
   * Returns true if this game is over.
   *
   * @returns
   */
  isGameOver(): boolean {
    return Boolean(this.#board.current.status);
  }

  /**
   * Performs a chess move. The current player is assumed from the board state.
   *
   * The "move" parameter can be in one or two formats:
   *
   * 1. A short string in [UCI (Universal Chess Interface)](https://en.wikipedia.org/wiki/Universal_Chess_Interface)
   *    format. These strings look like "e2e4", with both the departing and destination coordinates right next to each
   *    other. (We allow a space or hyphen to separate the two coords, but they are not required.) To promote when using
   *    this move format, provide the second "promote" parameter.
   *
   * 2. A short string in [SAN (Standard Algebraic Notation)](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))
   *    format. These strings look like "e4" to move the e-file pawn up, or "Raxa4" if the a-file rook captured
   *    something on a4. When using this format, the promote property is always ignored: Instead, use "=" plus the
   *    correct chess piece type (N, B, R, or Q) in the move string.
   *
   * @param move A string like "b1c3", "d1-h5", "Nf3", or "axb8=Q".
   * @param promote Either "Q", "N", "R" or "B".
   */
  public move(move: string, promote?: "B" | "R" | "N" | "Q"): ChessGame {
    if (this.isGameOver()) {
      throw new ChessGameOver();
    }

    // This method handles both UCI and SAN:
    const record = doGameMove(this.#board, move, promote);
    this.#moves.push(record);

    // Did the move checkmate or draw the game? If so, update the winner accordingly:
    this.maybeRefreshWinner();

    return this;
  }

  /**
   * Returns all available moves for the current player. If a coord is provided, only moves for the piece at that coord
   * will be returned. If that space is either empty, or holds a piece that belongs to the other player, an empty array
   * will be returned.
   *
   * Moves are described by objects, with 'from', 'dest', and 'promotion' properties.
   *
   * @param coord An optional coordinate, formatted in algebraic notation, so like "a5".
   */
  allMoves(coord?: string): MoveDetails[] {
    if (this.isGameOver()) {
      return [];
    }

    const turn = this.#board.current.turn;
    let moves;

    if (coord == null) {
      moves = listAllValidMoves(this.#board, turn);
    } else {
      const idx = coordFromAN(coord);
      const sp = this.#board.get(idx);
      if (sp === SPACE_EMPTY || spaceGetColor(sp) !== turn) {
        return [];
      }
      moves = listValidMoves(this.#board, idx);
    }
    return moves.map((move) => ({
      from: coordToAN(move.from),
      dest: coordToAN(move.dest),
      promotion: Boolean(move.promote),
    }));
  }

  /**
   * Resigns the game for the given player. This means that the OTHER player won.
   *
   * @param player The player who resigned.
   */
  resignGame(player: "white" | "black") {
    if (this.isGameOver()) {
      throw new ChessGameOver();
    }

    this.#board.current.status = GAMESTATUS_RESIGNED;
    this.#gameWinner = (player === "white") ? "black" : "white";
  }

  /**
   * Either both players agreed to a draw, or the game was drawn for some other reason.
   *
   * @param reason A string describing why the game was drawn. Optional.
   */
  drawGame(reason?: string) {
    if (this.isGameOver()) {
      throw new ChessGameOver();
    }
    this.#board.current.status = GAMESTATUS_DRAW;
    if (reason) {
      this.#drawReason = reason;
    }
  }

  /**
   * Render the game in a variety of formats. Default is "ascii", but other formats can be selected by passing in a
   * string.
   *
   * - `"ascii"`: The board state, rendered as ASCII art.
   * - `"terminal"`: The same as "ascii", but with ANSI color codes, giving color to the board and pieces. Useful when
   *   console.log()-ing to a terminal.
   * - `"fen"`: The board state, as a FEN string.
   * - `"pgn"`: The game, as a PGN string.
   *
   * @param fmt The format string
   * @returns
   */
  toString(fmt: "pgn" | "ascii" | "terminal" | "fen" = "ascii"): string {
    switch (fmt) {
      case "ascii":
        return boardRenderASCII(this.#board, false);
      case "terminal":
        return boardRenderASCII(this.#board, true);
      case "fen":
        return boardToFEN(this.#board);
      case "pgn": {
        return gameToPGN({
          board: this.#board,
          winner: this.#gameWinner,
          moves: this.#moves,
          tags: this.#tags,
        });
      }
      default:
        throw new ChessBadInput(fmt);
    }
  }

  private maybeRefreshWinner() {
    const status = this.#board.current.status;
    const turn = this.#board.current.turn;

    if (status === GAMESTATUS_CHECKMATE) {
      // Winner is the person who ISN'T currently checkmated:
      this.#gameWinner = (turn === COLOR_WHITE) ? "black" : "white";
    } else if (status >= GAMESTATUS_DRAW) {
      this.#gameWinner = "draw";
    }
  }
}
