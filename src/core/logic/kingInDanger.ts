import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import { spaceGetColor, spaceGetType } from "../datatypes/Space.ts";
import { PIECETYPE_KING } from "../datatypes/PieceType.ts";
import { attackMapIsAttacked } from "./attackMap.ts";

export function kingInDanger(b: Board, kingColor: Color): boolean {
  const enemy = 8 - kingColor;
  for (const idx of b.current.pieceList) {
    const spot = b.get(idx);
    if (
      spaceGetType(spot) !== PIECETYPE_KING || spaceGetColor(spot) !== kingColor
    ) {
      continue;
    }

    if (attackMapIsAttacked(b, idx, enemy)) {
      return true;
    }
  }
  return false;
}
