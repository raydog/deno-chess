import { Board } from "../core/datatypes/Board.ts";
import {
  ChessBadMove,
  ChessNeedsPromotion,
} from "../core/datatypes/ChessError.ts";
import { COLOR_WHITE } from "../core/datatypes/Color.ts";
import { coordFromAN, coordToAN } from "../core/datatypes/Coord.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KNIGHT,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../core/datatypes/PieceType.ts";
import { SPACE_EMPTY } from "../core/datatypes/Space.ts";
import { findMoveBySAN } from "../core/logic/findMoveBySAN.ts";
import { listAllValidMoves } from "../core/logic/listValidMoves.ts";
import { moveToSAN } from "../core/logic/moveFormats/moveToSAN.ts";
import { checkMoveResults } from "../core/logic/moveResults.ts";
import { performMove } from "../core/logic/performMove.ts";
import { GameMove } from "./GameMove.ts";

const UCI_MOVE_RE = /^([a-h][1-8])[- ]*([a-h][1-8])$/;

const PROMOTE_MAP = {
  N: PIECETYPE_KNIGHT,
  B: PIECETYPE_BISHOP,
  R: PIECETYPE_ROOK,
  Q: PIECETYPE_QUEEN,
};

// Applies a move from the user.
export function doGameMove(
  board: Board,
  moveStr: string,
  promote: "B" | "R" | "N" | "Q" | undefined,
): GameMove {
  const match = moveStr.match(UCI_MOVE_RE);
  if (match) {
    return _uciMove(board, match[1], match[2], promote);
  }

  // Else, possibly SAN:
  return _sanMove(board, moveStr);
}

function _uciMove(
  board: Board,
  from: string,
  dest: string,
  promote: "B" | "R" | "N" | "Q" | undefined,
): GameMove {
  const fromIdx = coordFromAN(from), destIdx = coordFromAN(dest);

  // Sanity checks:
  const sp = board.get(fromIdx);
  if (sp === SPACE_EMPTY) {
    throw new ChessBadMove(`Departure square (${from}) is empty`);
  }

  // Get the full list of moves. We need the FULL list of moves (and not just the moves for this one piece) because
  // computing the SAN for a move needs to change how the origin is represented based on which moves are currently
  // available to the player:
  const turn = board.current.turn;
  const moves = listAllValidMoves(board, turn);
  const picked = moves.find((move) =>
    move.from === fromIdx && move.dest === destIdx
  );

  if (!picked) {
    throw new ChessBadMove(`Invalid move: ${from}${dest}`);
  }

  // Do we require a promotion?
  if (picked.promote) {
    if (promote == null) {
      throw new ChessNeedsPromotion();
    }
    picked.promote = PROMOTE_MAP[promote];
    if (!picked.promote) {
      throw new ChessBadMove(`Invalid promotion: ${promote}`);
    }
  }

  const num = board.current.moveNum;

  // Else, we have the correct move! Apply to to our own board:
  performMove(board, picked);

  const results = checkMoveResults(board, turn);
  board.current.status = results.newGameStatus;

  return {
    num,
    side: (turn === COLOR_WHITE) ? "white" : "black",
    from,
    dest,
    san: moveToSAN(moves, picked, results),
  };
}

function _sanMove(board: Board, san: string): GameMove {
  const turn = board.current.turn;
  const moves = listAllValidMoves(board, turn);
  const move = findMoveBySAN(moves, san);
  const num = board.current.moveNum;

  performMove(board, move);

  const results = checkMoveResults(board, turn);
  board.current.status = results.newGameStatus;

  return {
    num,
    side: (turn === COLOR_WHITE) ? "white" : "black",
    from: coordToAN(move.from),
    dest: coordToAN(move.dest),
    san: moveToSAN(moves, move, results),
  };
}
