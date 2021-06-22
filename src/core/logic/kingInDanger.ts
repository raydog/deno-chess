import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import {
  SPACE_EMPTY,
  spaceGetColor,
  spaceGetType,
} from "../datatypes/Space.ts";
import { PIECETYPE_KING } from "../datatypes/PieceType.ts";
import { attackMapIsAttacked } from "./attackMap.ts";

export function kingInDanger(b: Board, kingColor: Color): boolean {
  const enemy = 8 - kingColor;
  for (let rank = 0; rank < 0x80; rank += 0x10) {
    for (let file = 0; file < 0x8; file++) {
      const idx = rank | file;

      const spot = b.get(idx);
      if (
        spot === SPACE_EMPTY || spaceGetType(spot) !== PIECETYPE_KING ||
        spaceGetColor(spot) !== kingColor
      ) {
        continue;
      }

      if (attackMapIsAttacked(b, idx, enemy)) {
        return true;
      }
    }
  }
  return false;
}
