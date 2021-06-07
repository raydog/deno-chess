import { Board } from "../../src/core/datatypes/Board.ts";
import { buildCastleMap } from "../../src/core/datatypes/CastleMap.ts";
import { Coord, coordFromAN } from "../../src/core/datatypes/Coord.ts";
import {
  PIECETYPE_KING,
  PIECETYPE_ROOK,
} from "../../src/core/datatypes/PieceType.ts";
import {
  Space,
  SPACE_EMPTY,
  spaceGetType,
  spaceHasMoved,
} from "../../src/core/datatypes/Space.ts";

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
  out.current.castles = buildCastleMap(
    _coordIfValid(out, 0x04, 0x00),
    _coordIfValid(out, 0x04, 0x07),
    _coordIfValid(out, 0x74, 0x70),
    _coordIfValid(out, 0x74, 0x77),
  );
  return out;
}

function _coordIfValid(b: Board, king: Coord, rook: Coord): Coord {
  const k = b.get(king), r = b.get(rook);
  if (
    k === SPACE_EMPTY || spaceHasMoved(k) || spaceGetType(k) !== PIECETYPE_KING
  ) {
    return 0x88;
  }
  if (
    r === SPACE_EMPTY || spaceHasMoved(r) || spaceGetType(r) !== PIECETYPE_ROOK
  ) {
    return 0x88;
  }
  return rook;
}
