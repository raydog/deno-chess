import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import { GameStatus, GAMESTATUS_CHECKMATE, GAMESTATUS_DRAW_FIFTYMOVES, GAMESTATUS_DRAW_NOMATERIAL, GAMESTATUS_DRAW_REPETITION, GAMESTATUS_DRAW_STALEMATE } from "../datatypes/GameStatus.ts";
import { Move } from "../datatypes/Move.ts";
import { spaceGetColor } from "../datatypes/Space.ts";
import { boardLacksMaterial } from "./boardLacksMaterial.ts";
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

  const moveColor = spaceGetColor(move.what);

  performMove(board, move);
  const out: MoveResults = checkMoveResults(board, moveColor);

  board.restore();

  return out;
}

/**
 * Get the results of a move. Assumes that the move has already been done.
 *
 * @param board
 * @param move
 */
export function checkMoveResults(board: Board, moveColor: Color): MoveResults {
  const enemy = 1 - moveColor;

  const enemyInCheck = kingInDanger(board, enemy);

  // TODO: Fork this into a version that DOESN'T allocate an array of objects, and instead short-circuits a bool:
  const enemyCanMove = listAllValidMoves(board, enemy).length > 0;

  const timesMoveSeen = board.putBoardHash(hashBoard(board));

  const newGameStatus = _nextState(
    board,
    enemyInCheck,
    enemyCanMove,
    timesMoveSeen,
  );

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

  // If no moves, this is DEFINITELY a terminal state.
  if (!enemyCanMove) {
    if (enemyInCheck) {
      // CHECKMATE
      return GAMESTATUS_CHECKMATE;
    }
    // Else, STALEMATE:
    return GAMESTATUS_DRAW_STALEMATE;
  }

  // Else, there are a few other situations that can trigger end-of-game:
  if (board.getClock() >= 100) {
    return GAMESTATUS_DRAW_FIFTYMOVES;
  }

  if (timesMoveSeen >= 3) {
    return GAMESTATUS_DRAW_REPETITION;
  }

  if (boardLacksMaterial(board)) {
    return GAMESTATUS_DRAW_NOMATERIAL;
  }

  // Else, the game is still on. Toggle the player:
  return priorStatus;
}
