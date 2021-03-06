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
import { coordToAN } from "../../core/datatypes/Coord.ts";
import {
  GAMESTATUS_CHECKMATE,
  GAMESTATUS_DRAW,
} from "../../core/datatypes/GameStatus.ts";
import { Move } from "../../core/datatypes/Move.ts";
import { boardRenderASCII } from "../../core/logic/boardRenderASCII.ts";
import { moveToSAN } from "../../core/logic/moveFormats/moveToSAN.ts";
import { checkMoveResults } from "../../core/logic/moveResults.ts";
import { performMove } from "../../core/logic/performMove.ts";
import { GameScore, moveScore } from "./gameScore.ts";
import { mateScore } from "./gameScore.ts";

// TODO: Test nullable prop vs optional prop perf.
type MiniMaxResponse = { score: GameScore; move?: Move; nodes: number };
type ListMovesFn = (b: Board) => Move[];
type RateBoardFn = (b: Board) => number;

export function searchBestMoves(
  board: Board,
  color: Color,
  maxDepth: number,
  listMoves: ListMovesFn,
  rateBoard: RateBoardFn,
) {
  return miniMax(
    board,
    color,
    0,
    maxDepth,
    -Infinity,
    Infinity,
    listMoves,
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
  listMoves: ListMovesFn,
  rateBoard: RateBoardFn,
): MiniMaxResponse {
  const enemy = 8 - color;

  // Checkmates cause a surprise leaf:
  const res = checkMoveResults(board, enemy);
  if (res.newGameStatus === GAMESTATUS_CHECKMATE) {
    const score = mateScore(
      enemy === COLOR_WHITE ? curDepth + 1 : -curDepth - 1,
    );
    return { score, nodes: 1 };
  }

  // Same thing with the various draw conditions:
  if (res.newGameStatus >= GAMESTATUS_DRAW) {
    // TODO: Treat an early draw as an enemy checkmate
    return { score: 0, nodes: 1 };
  }

  // Reached the tree's horizon:
  if (curDepth >= maxDepth) {
    // console.log("> ".repeat(curDepth) + "LEAF:", moveScore(rateBoard(board)));
    // console.log(boardRenderASCII(board, true));
    return { score: moveScore(rateBoard(board)), nodes: 1 };
  }

  let best: GameScore = (color === COLOR_WHITE) ? -Infinity : Infinity;
  let bestMoves: Move[] = [];

  const orderedMoves = listMoves(board);

  let nodes = 0;

  for (const move of orderedMoves) {
    board.save();

    // console.log("> ".repeat(curDepth) + "MOVE:", moveToSAN(orderedMoves, move));

    performMove(board, move);

    const { score, nodes: branchNodes } = miniMax(
      board,
      enemy,
      curDepth + 1,
      maxDepth,
      alpha,
      beta,
      listMoves,
      rateBoard,
    );

    // if (!curDepth) {
    //   console.log(moveToSAN(orderedMoves, move), score);
    // }

    board.restore();

    nodes += branchNodes;

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
      if (best >= beta) {
        // console.log("> ".repeat(curDepth) + "BAIL:", beta, ">=", best);
        break;
      }
      if (alpha < best) {
        alpha = best;
      }

      // Minimizer
    } else if (color === COLOR_BLACK) {
      if (score < best) {
        best = score;
        bestMoves = [move];
      }
      if (best <= alpha) {
        // console.log("> ".repeat(curDepth) + "BAIL:", best, "<=", alpha);
        break;
      }
      if (beta > best) {
        beta = score;
      }
    }
  }

  return curDepth
    ? { score: best, nodes }
    : { score: best, move: _pickOne(bestMoves), nodes };
}

function _pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
