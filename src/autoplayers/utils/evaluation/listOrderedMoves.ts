import { Board } from "../../../core/datatypes/Board.ts";
import { Color, COLOR_WHITE } from "../../../core/datatypes/Color.ts";
import { Move } from "../../../core/datatypes/Move.ts";
import { spaceGetType } from "../../../core/datatypes/Space.ts";
import { attackMapIsAttacked } from "../../../core/logic/attackMap.ts";
import { listAllValidMoves } from "../../../core/logic/listValidMoves.ts";
import { ScoreSettings } from "./ScoreSettings.ts";

export function listOrderedMoves(
  settings: ScoreSettings,
  board: Board,
): Move[] {
  const color = board.current.turn;
  const allMoves = listAllValidMoves(board, color);
  const scoredMoves = allMoves.map((move) => ({
    move,
    score: moveScore(settings, board, move, color),
  }));

  scoredMoves.sort((a, b) => {
    return b.score - a.score;
  });

  return scoredMoves.map(({ move }) => move);
}

// Rate moves LIKELY to be good higher, so minimax tries those branches first:
function moveScore(
  { Material }: ScoreSettings,
  board: Board,
  move: Move,
  color: Color,
): number {
  let score = 0;

  // Captures are always worth something, but prioritize captures of high-value stuff with low-value stuff:
  if (move.capture) {
    score += 1000 + Material[spaceGetType(move.capture)] -
      Material[spaceGetType(move.what)];
  }

  // Promotions net us the material of the new piece type:
  if (move.promote) {
    score += Material[move.promote];
  }

  // If the destination is attacked, we should be cautious:
  const enemy = 8 - color;
  if (attackMapIsAttacked(board, move.dest, enemy)) {
    score -= Material[spaceGetType(move.what)];
  }

  // In general, we like moving into enemy territory:
  if (color === COLOR_WHITE) {
    score += (move.dest >>> 4) - (move.from >>> 4);
  } else {
    score += (move.from >>> 4) - (move.dest >>> 4);
  }

  return score;
}
