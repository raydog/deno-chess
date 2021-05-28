import { Board } from "../datatypes/Board.ts";
import { Move } from "../datatypes/Move.ts";
import { spaceGetColor } from "../datatypes/Space.ts";
import { kingInDanger } from "./kingInDanger.ts";
import { listAllValidMoves } from "./listValidMoves.ts";
import { performMove } from "./performMove.ts";

/**
 * What are the consequences of a particular move?
 */
export type MoveResults = {
  /**
   * Did a move leave an enemy in check?
   */
  enemyInCheck: boolean,

  /**
   * Does the enemy have any valid moves left?
   */
  enemyCanMove: boolean,
};

/**
 * Will apply a move, check it's results, and roll the move back:
 * 
 * @param board 
 * @param move 
 * @returns 
 */
export function moveAndCheckResults(board: Board, move: Move) {
  board.save();

  performMove(board, move);
  const out: MoveResults = checkMoveResults(board, move);

  board.restore();

  return out;
}

/**
 * Get the results of a move. Assumes that the move has already been done.
 * 
 * @param board 
 * @param move 
 */
export function checkMoveResults(board: Board, move: Move): MoveResults {
  
  const color = spaceGetColor(move.what);
  const enemy = 1 - color;

  return {
    enemyInCheck: kingInDanger(board, enemy),
    // TODO: Fork this into a version that DOESN'T allocate an array of objects, and instead short-circuits a bool:
    enemyCanMove: listAllValidMoves(board, enemy).length > 0,
  };
}
