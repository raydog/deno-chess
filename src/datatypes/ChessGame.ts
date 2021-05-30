// Note: the class in this file serves as the external API.

import { boardRenderASCII } from "../logic/boardFormats/boardRenderASCII.ts";
import { buildStandardBoard } from "../logic/boardLayouts/standard.ts";
import { hashBoard } from "../logic/hashBoard.ts";
import { listAllValidMoves, listValidMoves } from "../logic/listValidMoves.ts";
import { moveToSAN } from "../logic/moveFormats/moveToSAN.ts";
import { checkMoveResults } from "../logic/moveResults.ts";
import { performMove } from "../logic/performMove.ts";
import { Board } from "./Board.ts";
import { ChessBadMove, ChessError, ChessGameOver } from "./ChessError.ts";
import { Color } from "./Color.ts";
import { coordFromAN, coordToAN } from "./Coord.ts";
import { GameStatus } from "./GameStatus.ts";
import { Move } from "./Move.ts";
import { spaceGetColor, spaceIsEmpty } from "./Space.ts";

const MOVE_RE = /^([a-h][1-8])[- ]*([a-h][1-8])$/i;

type AnnotatedMove = {
  move: Move;
  san: string;
};

/**
 * A record of a single
 */
export type HistoryEntry = {
  num: number;
  white: string;
  black: string | null;
};

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
}

/**
 * A single chess game.
 */
export class ChessGame {
  #board: Board;
  #moves: AnnotatedMove[] = [];
  #color: boolean = (typeof Deno !== "undefined" && Deno.noColor === false);

  private constructor(b: Board) {
    this.#board = b;
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
   * Return a list of all turns in the game.
   *
   * @returns
   */
  history(): HistoryEntry[] {
    return this.#moves
      .reduce((acc, move, idx) => {
        const isBlack = Boolean(idx & 1);
        if (isBlack) {
          acc[acc.length - 1].black = move.san;
        } else {
          acc.push({
            num: (idx >> 1) + 1,
            white: move.san,
            black: null,
          });
        }
        return acc;
      }, [] as HistoryEntry[]);
  }

  /**
   * What's the game's status? Details the turn (if active), the winner (if checkmate), or the terminal state, if the
   * game was drawn for some reason.
   *
   * @returns A status string.
   */
  getStatus(): Status {
    return {
      state: _gameStatusString(this.#board.getStatus()),
      turn: (this.#board.getTurn() === Color.White) ? "white" : "black",
    };
  }

  /**
   * Returns true if this game is over.
   *
   * @returns
   */
  isGameOver(): boolean {
    return Boolean(this.#board.getStatus());
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
  public move(move: string, promote = "Q"): ChessGame {
    if (this.isGameOver()) {
      throw new ChessGameOver();
    }

    const m = move.match(MOVE_RE);
    if (!m) throw new ChessBadMove(`Unknown move format: ${move}`);

    const from = coordFromAN(m[1]), dest = coordFromAN(m[2]);

    // Sanity checks:
    const sp = this.#board.get(from);
    if (spaceIsEmpty(sp)) {
      throw new ChessBadMove(
        `${move}: Departing square (${coordToAN(from)}) is empty`,
      );
    }

    // Get the full list of moves. We need the FULL list of moves (and not just the moves for this one piece) because
    // computing the SAN for a move needs to change how the origin is represented based on which moves are currently
    // available to the player:
    const turn = this.#board.getTurn();
    const moves = listAllValidMoves(this.#board, turn);
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

    this.#board.setTurn(1 - this.#board.getTurn());
    this.#board.setStatus(results.newGameStatus);

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
    if (this.isGameOver()) {
      return [];
    }

    const turn = this.#board.getTurn();
    let moves;

    if (coord == null) {
      moves = listAllValidMoves(this.#board, turn);
    } else {
      const idx = coordFromAN(coord);
      const sp = this.#board.get(idx);
      if (spaceIsEmpty(sp) || spaceGetColor(sp) !== turn) {
        return [];
      }
      moves = listValidMoves(this.#board, idx);
    }
    return moves.map((move) =>
      `${coordToAN(move.from)}${coordToAN(move.dest)}`
    );
  }

  toString(color = this.#color): string {
    return boardRenderASCII(this.#board, color);
  }

  hash(): string {
    return hashBoard(this.#board);
  }
}

// Convert our own status enum into an externally-available string:
function _gameStatusString(status: GameStatus): Status["state"] {
  switch (status) {
    case GameStatus.Active:
      return "active";
    case GameStatus.Checkmate:
      return "checkmate";
    case GameStatus.Draw:
      return "draw-other";
    case GameStatus.DrawStalemate:
      return "draw-stalemate";
    case GameStatus.DrawRepetition:
      return "draw-repetition";
    case GameStatus.DrawFiftyMove:
      return "draw-fifty-moves";
    case GameStatus.DrawNoMaterial:
      return "draw-no-material";
    default:
      // For some reason, Typescript isn't type-narrowing this:
      throw new ChessError("Bad status code: " + status);
  }
}
