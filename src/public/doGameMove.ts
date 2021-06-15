import { Board } from "../core/datatypes/Board.ts";
import {
  ChessBadMove,
  ChessNeedsPromotion,
} from "../core/datatypes/ChessError.ts";
import { COLOR_WHITE } from "../core/datatypes/Color.ts";
import { coordFromAN, coordToAN } from "../core/datatypes/Coord.ts";
import {
  PieceType,
  PIECETYPE_BISHOP,
  PIECETYPE_KNIGHT,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../core/datatypes/PieceType.ts";
import { findMoveBySAN } from "../core/logic/findMoveBySAN.ts";
import { listAllValidMoves } from "../core/logic/listValidMoves.ts";
import { moveToSAN } from "../core/logic/moveFormats/moveToSAN.ts";
import { checkMoveResults } from "../core/logic/moveResults.ts";
import { performMove } from "../core/logic/performMove.ts";
import { GameMoveInternal } from "./GameMove.ts";

const UCI_MOVE_RE = /^([a-h][1-8])[- ]*([a-h][1-8])([bnrqBNRQ])?$/;

const PROMOTE_MAP: { [type: string]: PieceType } = {
  N: PIECETYPE_KNIGHT,
  B: PIECETYPE_BISHOP,
  R: PIECETYPE_ROOK,
  Q: PIECETYPE_QUEEN,
};

// Applies a move from the user.
export function doGameMove(board: Board, moveStr: string): GameMoveInternal {
  const match = moveStr.match(UCI_MOVE_RE);
  if (match) {
    return _uciMove(board, match[1], match[2], match[3]);
  }

  // Else, possibly SAN:
  return _sanMove(board, moveStr);
}

function _uciMove(
  board: Board,
  from: string,
  dest: string,
  promote: string,
): GameMoveInternal {
  const fromIdx = coordFromAN(from), destIdx = coordFromAN(dest);
  let promoteType: PieceType | 0 = 0;

  if (promote) {
    promoteType = PROMOTE_MAP[promote.toUpperCase()];
    if (!promoteType) {
      throw new ChessBadMove(`Invalid promotion: ${promote}`);
    }
  }

  // Get the full list of moves. We need the FULL list of moves (and not just the moves for this one piece) because
  // computing the SAN for a move needs to change how the origin is represented based on which moves are currently
  // available to the player:
  const turn = board.current.turn;
  const moves = listAllValidMoves(board, turn);
  const picked = moves.find((move) =>
    move.from === fromIdx && move.dest === destIdx &&
    (promoteType ? move.promote === promoteType : true)
  );

  if (!picked) {
    throw new ChessBadMove(`Invalid move: ${from}${dest}${promote || ""}`);
  }

  if (picked.promote && !promoteType) {
    throw new ChessNeedsPromotion();
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
    move: picked,
  };
}

function _sanMove(board: Board, san: string): GameMoveInternal {
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
    move,
  };
}
