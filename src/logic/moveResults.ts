import { Board } from "../datatypes/Board.ts";
import { GameStatus } from "../datatypes/GameStatus.ts";
import { Move } from "../datatypes/Move.ts";
import { spaceGetColor } from "../datatypes/Space.ts";
import { assert } from "./assert.ts";
import { hashBoard } from "./hashBoard.ts";
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
  enemyInCheck: boolean;

  /**
   * Does the enemy have any valid moves left?
   */
  enemyCanMove: boolean;

  /**
   * The game's state after this move.
   */
  newGameStatus: GameStatus;
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

  const enemyInCheck = kingInDanger(board, enemy);

  // TODO: Fork this into a version that DOESN'T allocate an array of objects, and instead short-circuits a bool:
  const enemyCanMove = listAllValidMoves(board, enemy).length > 0;

  const timesMoveSeen = board.putBoardHash(hashBoard(board));

  const newGameStatus = _nextState(board, enemyInCheck, enemyCanMove, timesMoveSeen);

  return {
    enemyInCheck,
    enemyCanMove,
    newGameStatus,
  };
}

function _nextState(
  board: Board,
  enemyInCheck: boolean,
  enemyCanMove: boolean,
  timesMoveSeen: number,
): GameStatus {
  const priorStatus = board.getStatus();

  // If we're moving, this had better
  assert(priorStatus <= 1, "Attempting to move after game is over");

  // If no moves, this is DEFINITELY a terminal state.
  if (!enemyCanMove) {
    if (enemyInCheck) {
      // CHECKMATE
      return GameStatus.CheckmateWhite + priorStatus;
    }
    // Else, STALEMATE:
    return GameStatus.DrawStalemate;
  }

  // Else, there are a few other situations that can trigger end-of-game:
  if (board.getClock() >= 100) {
    return GameStatus.DrawFiftyMove;
  }

  if (timesMoveSeen >= 3) {
    return GameStatus.DrawRepetition;
  }

  // Else, the game is still on. Toggle the player:
  return 1 - priorStatus;
}
