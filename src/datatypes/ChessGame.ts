// Note: the class in this file serves as the external API.

import { buildStandardBoard } from "../logic/boardLayouts/standard.ts";
import { listAllValidMoves, listValidMoves } from "../logic/listValidMoves.ts";
import { moveToSAN } from "../logic/moveFormats/moveToSAN.ts";
import { checkMoveResults } from "../logic/moveResults.ts";
import { performMove } from "../logic/performMove.ts";
import { Board } from "./Board.ts";
import { ChessBadMove, ChessGameOver } from "./ChessError.ts";
import { Color } from "./Color.ts";
import { coordFromAN, coordToAN } from "./Coord.ts";
import { Move } from "./Move.ts";
import { spaceGetColor, spaceHasData, spaceIsEmpty } from "./Space.ts";

const MOVE_RE = /^([a-h][1-8])-?([a-h][1-8])$/i;

type AnnotatedMove = {
  move: Move;
  san: string;
};

type HistoryEntry = {
  num: number;
  side: "w" | "b";
  san: string;
};

/**
 * A single chess game.
 */
export class ChessGame {
  #state: GameState = GameState.active;
  #turn: Color = Color.White;
  #board: Board;
  #moves: AnnotatedMove[] = [];

  private constructor(b: Board) {
    this.#board = b;
  }

  /**
   * Used in benchmarks
   * @private
   */
  private _getBoard(): Board {
    return this.#board;
  }

  /**
   * Start a brand new chess game. The board is set up in the standard way, and it is White's turn to play.
   *
   * @returns The new ChessGame.
   */
  public static NewStandardGame(): ChessGame {
    return new ChessGame(buildStandardBoard());
  }

  history(): HistoryEntry[] {
    return this.#moves.map((move, idx) => {
      return {
        num: (idx >>> 1) + 1,
        side: (idx & 0x1) ? "b" : "w",
        san: move.san,
      };
    });
  }

  /**
   * Performs a chess move. The current player is assumed from the board state.
   *
   * The format for the move is a short string in UCI format, with both the departing and destination cordinate right
   * next to each other. (An optional hyphen can be included if you want.) For example, a classic King's opening would
   * look like: "e2e4" or "e2-e4", if you opt to include the hyphen. This is not full algebraic notation, so don't add
   * "x" to indicate capture, don't add "=Q" to indicate promotion, etc.
   *
   * If this move involves a pawn reaching its final rank (and so it's promoting) you can add the additional `promote`
   * parameter to indicate what piece type this should promote to. If omitted, Queen is assumed. If this parameter is
   * included when this ISN'T a promotion, it'll just be ignored. Trying to promote to a Pawn will error.
   *
   * @param move A string like "b1c3", "d1-h5", etc.
   * @param promote
   */
  public move(move: string, promote: Piece = Piece.Q): ChessGame {
    if (this.#state !== "active") {
      throw new ChessGameOver();
    }

    const m = move.match(MOVE_RE);
    if (!m) throw new ChessBadMove(`Unknown move format: ${move}`);

    const from = coordFromAN(m[1]), dest = coordFromAN(m[2]);

    // Sanity checks:
    const sp = this.#board.get(from);
    if (!spaceHasData(sp) || spaceIsEmpty(sp)) {
      throw new ChessBadMove(
        `${move}: Departing square (${coordToAN(from)}) is empty`,
      );
    }

    // Get the full list of moves. We need the FULL list of moves (and not just the moves for this one piece) because
    // computing the SAN for a move needs to change how the origin is represented based on which moves are currently
    // available to the player:
    const moves = listAllValidMoves(this.#board, this.#turn);
    const picked = moves.find((move) =>
      move.from === from && move.dest === dest
    );
    if (!picked) {
      throw new ChessBadMove(`${move}: Invalid move`);
    }

    // Else, we have the correct move! Apply to to our own board:
    performMove(this.#board, picked);

    const results = checkMoveResults(this.#board, picked);

    this.#moves.push({
      move: picked,
      san: moveToSAN(moves, picked, results),
      // san: al
    });
    this.#turn = 1 - this.#turn;

    return this;
  }

  /**
   * Returns all available moves for the current player. If a coord is provided, only moves for the piece at that coord
   * will be returned. If that space is either empty, or holds a piece that belongs to the other player, an empty array
   * will be returned.
   *
   * Moves will be returned in UCI format, with the departing and destination coordinates right next to each other. So,
   * "e2e4" will be returned for the classic King's opening.
   *
   * @param coord An optional coordinate, formatted in algebraic notation, so like "a5".
   */
  allMoves(coord?: string): string[] {
    let moves;
    if (coord == null) {
      moves = listAllValidMoves(this.#board, this.#turn);
    } else {
      const idx = coordFromAN(coord);
      const sp = this.#board.get(idx);
      if (spaceIsEmpty(sp) || spaceGetColor(sp) !== this.#turn) {
        return [];
      }
      moves = listValidMoves(this.#board, idx);
    }
    return moves.map((move) =>
      `${coordToAN(move.from)}${coordToAN(move.dest)}`
    );
  }
}

/**
 * A side in the game. Either white or black.
 */
export const enum Side {
  "white" = "white",
  "black" = "black",
} /**
 * A piece type, abbreviated to one character.
 */

export const enum Piece {
  /**
   * Pawn
   */
  P = "P",

  /**
   * Bishop
   */
  B = "B",

  /**
   * Knight
   */
  N = "N",

  /**
   * Rook
   */
  R = "R",

  /**
   * Queen
   */
  Q = "Q",

  /**
   * King
   */
  K = "K",
}

/**
 * The state of the current game. If the game is over (or drawn) will also explain why.
 */
export const enum GameState {
  /**
   * The game is active. `Game.turn` describes who's the next to move.
   */
  "active" = "active",

  /**
   * The game is over. `Game.turn` describes who has won.
   */
  "checkmate" = "checkmate",

  /**
   * The game is over, since it is `Game.turn`'s move, and they have no legal moves available to them.
   */
  "draw:stalemate" = "draw:stalemate",

  /**
   * The game is over, since it is the 3rd time that this current board state has been encountered.
   */
  "draw:repetition" = "draw:repetition",

  /**
   * The game is over, since it's been 50 moves since the last capture or pawn move.
   */
  "draw:fifty-moves" = "draw:fifty-moves",

  /**
   * The game is over, since there just isn't enough material left on the board to deliver checkmate.
   */
  "draw:no-material" = "draw:no-material",
}
