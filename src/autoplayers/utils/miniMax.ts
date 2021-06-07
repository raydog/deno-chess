/**
 * This file implements a basic MiniMax tree, with alpha-beta pruning handled for us.
 *
 * - Leafs are where the board evaluations happen. "Surprise Leafs" are leafs that happen before the max-depth horizon
 *   is reached. (Basically, checkmates)
 * - Branches are either Minimizers or Maximizers, which pick a child base on the minimum (or maximum) score amongst
 *   them.
 */

import { Board } from "../../core/datatypes/Board.ts";
import { Color, COLOR_BLACK, COLOR_WHITE } from "../../core/datatypes/Color.ts";
import { GAMESTATUS_CHECKMATE } from "../../core/datatypes/GameStatus.ts";
import { Move } from "../../core/datatypes/Move.ts";
import { listAllValidMoves } from "../../core/logic/listValidMoves.ts";
import { checkMoveResults } from "../../core/logic/moveResults.ts";
import { performMove } from "../../core/logic/performMove.ts";
import { GameScore, moveScore } from "./gameScore.ts";
import { mateScore } from "./gameScore.ts";

// TODO: Test nullable prop vs optional prop perf.
type MiniMaxResponse = { score: GameScore; move?: Move };
type CompareMoveFn = (a: Move, b: Move) => number;
type RateBoardFn = (b: Board) => number;

export function searchBestMoves(
  board: Board,
  color: Color,
  maxDepth: number,
  compareMoves: CompareMoveFn,
  rateBoard: RateBoardFn,
) {
  return miniMax(
    board,
    color,
    0,
    maxDepth,
    -Infinity,
    Infinity,
    compareMoves,
    rateBoard,
  );
}

function miniMax(
  board: Board,
  color: Color,
  curDepth: number,
  maxDepth: number,
  alpha: GameScore,
  beta: GameScore,
  compareMoves: CompareMoveFn,
  rateBoard: RateBoardFn,
): MiniMaxResponse {
  const enemy = 1 - color;

  // Checkmates cause a surprise leaf:
  const res = checkMoveResults(board, enemy);
  if (res.newGameStatus === GAMESTATUS_CHECKMATE) {
    return { score: mateScore(-curDepth) };
  }

  // Reached the tree's horizon:
  if (curDepth >= maxDepth) {
    return { score: moveScore(rateBoard(board)) };
  }

  let best: GameScore = (color === COLOR_WHITE) ? -Infinity : Infinity;
  let bestMoves: Move[] = [];

  const allMoves = listAllValidMoves(board, color);
  const orderedMoves = [...allMoves].sort(compareMoves);

  for (const move of orderedMoves) {
    board.save();

    performMove(board, move);

    const { score } = miniMax(
      board,
      enemy,
      curDepth + 1,
      maxDepth,
      alpha,
      beta,
      compareMoves,
      rateBoard,
    );

    board.restore();

    // Easy case: Whether minimizing or maximizing: we've seen this literal score before, so
    // we can just store it as an alternative: it shouldn't cause alpha or beta bailouts:
    if (score === best) {
      bestMoves.push(move);

      // Maximizer
    } else if (color === COLOR_WHITE) {
      if (score > best) {
        best = score;
        bestMoves = [move];
      }
      if (alpha < score) {
        alpha = score;
      }
      if (alpha >= beta) {
        break;
      }

      // Minimizer
    } else if (color === COLOR_BLACK) {
      if (score < best) {
        best = score;
        bestMoves = [move];
      }
      if (beta > score) {
        beta = score;
      }
      if (beta <= alpha) {
        break;
      }
    }
  }

  return curDepth
    ? { score: best }
    : { score: best, move: _pickOne(bestMoves) };
}

function _pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
