import { Board } from "../datatypes/Board.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KNIGHT,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../datatypes/PieceType.ts";
import { listAllValidMoves } from "./listValidMoves.ts";
import { performMove } from "./performMove.ts";

const PROMOTIONS = [
  PIECETYPE_BISHOP,
  PIECETYPE_ROOK,
  PIECETYPE_KNIGHT,
  PIECETYPE_QUEEN,
];

/**
 * Count the number of plays given the provided depth. Used to verify the move generator.
 *
 * @param board
 * @param depth
 */
export function perft(board: Board, depth: number): number {
  if (depth <= 0) return 1;

  let num = 0;
  const moves = listAllValidMoves(board, board.current.turn);

  for (const move of moves) {
    // Special-case. Perft counts promotions all as separate moves, but we treat it as a single pawn move:
    if (move.promote) {
      for (const type of PROMOTIONS) {
        move.promote = type;
        board.save();
        performMove(board, move);
        const deep = perft(board, depth - 1);
        num += deep;
        board.restore();
      }
    } else {
      board.save();
      performMove(board, move);
      const deep = perft(board, depth - 1);
      num += deep;
      board.restore();
    }
  }

  return num;
}
