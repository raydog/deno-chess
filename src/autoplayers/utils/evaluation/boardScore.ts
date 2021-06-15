import { Board } from "../../../core/datatypes/Board.ts";
import { scoreMaterial } from "./scoreMaterial.ts";
import { scoreMobility } from "./scoreMobility.ts";
import { scorePawnStructures } from "./scorePawnStructure.ts";
import { ScoreSettings } from "./ScoreSettings.ts";

/**
 * The central "score this leaf" function. Returns a number for how desirable a position is, rated in centipawns.
 *
 * @param board
 * @param settings
 */
export function boardScore(board: Board, settings: ScoreSettings): number {
  let out = 0;
  out += scoreMaterial(board, settings);
  out += scoreMobility(board, settings);
  out += scorePawnStructures(board, settings);
  return out;
}
