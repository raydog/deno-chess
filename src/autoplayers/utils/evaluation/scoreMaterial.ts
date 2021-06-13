import { Board } from "../../../core/datatypes/Board.ts";
import { COLOR_WHITE } from "../../../core/datatypes/Color.ts";
import {
  SPACE_EMPTY,
  spaceGetColor,
  spaceGetType,
} from "../../../core/datatypes/Space.ts";
import { ScoreSettings } from "./scoreSettings.ts";

/**
 * Returns the pure-material score for the given board state.
 *
 * @param board
 * @param settings
 * @returns
 */
export function scoreMaterial(
  board: Board,
  { Material }: ScoreSettings,
): number {
  let net = 0;

  for (let rank = 0; rank < 0x80; rank += 0x10) {
    for (let file = 0; file < 0x8; file++) {
      const idx = rank | file;
      const spot = board.get(idx);

      if (spot === SPACE_EMPTY) continue;

      const type = spaceGetType(spot);
      const color = spaceGetColor(spot);

      if (color === COLOR_WHITE) {
        net += Material[type];
      } else {
        net -= Material[type];
      }
    }
  }

  return net;
}
