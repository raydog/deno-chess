import { Board } from "../../src/datatypes/Board.ts";
import { coordFromAN } from "../../src/datatypes/Coord.ts";
import { Space } from "../../src/datatypes/Space.ts";

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
  return out;
}
