import { Board } from "../../src/datatypes/Board.ts";
import { buildCastleMap } from "../../src/datatypes/CastleMap.ts";
import { Coord, coordFromAN } from "../../src/datatypes/Coord.ts";
import { PieceType } from "../../src/datatypes/PieceType.ts";
import {
  Space,
  spaceGetType,
  spaceHasMoved,
  spaceIsEmpty,
} from "../../src/datatypes/Space.ts";

type BoardLayout = {
  [an: string]: Space;
};

const HOP = <T>(obj: T, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Board factory, meant to make board construction for unit tests easier.
 *
 * @param layout
 * @returns
 */
export function boardLayout(layout: BoardLayout): Board {
  const out = new Board();
  for (const key in layout) {
    if (!HOP(layout, key)) continue;
    const coord = coordFromAN(key);
    out.set(coord, layout[key]);
  }
  // Note: This assumes a stardard board layout:
  out.setCastles(
    buildCastleMap(
      _coordIfValid(out, 0x04, 0x00),
      _coordIfValid(out, 0x04, 0x07),
      _coordIfValid(out, 0x74, 0x70),
      _coordIfValid(out, 0x74, 0x77),
    ),
  );
  return out;
}

function _coordIfValid(b: Board, king: Coord, rook: Coord): Coord {
  const k = b.get(king), r = b.get(rook);
  if (
    spaceIsEmpty(k) || spaceHasMoved(k) || spaceGetType(k) !== PieceType.King
  ) {
    return 0x88;
  }
  if (
    spaceIsEmpty(r) || spaceHasMoved(r) || spaceGetType(r) !== PieceType.Rook
  ) {
    return 0x88;
  }
  return rook;
}
