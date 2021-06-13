import { Board } from "../../../core/datatypes/Board.ts";
import { COLOR_BLACK, COLOR_WHITE } from "../../../core/datatypes/Color.ts";
import { listAllValidMoves } from "../../../core/logic/listValidMoves.ts";
import { ScoreSettings } from "./scoreSettings.ts";

/**
 * Returns a score for how mobile (or activated) each side is.
 *
 * @param board
 * @param settings
 * @returns
 */
export function scoreMobility(
  board: Board,
  { Mobility: { MoveScore } }: ScoreSettings,
): number {
  // TODO: These move sets need to be cached, so it doesn't hurt quite as much...
  return (
    listAllValidMoves(board, COLOR_WHITE).length -
    listAllValidMoves(board, COLOR_BLACK).length
  ) * MoveScore;
}
