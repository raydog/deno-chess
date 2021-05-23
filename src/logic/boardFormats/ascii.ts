import { Board } from "../../datatypes/Board.ts";
import { buildCoord } from "../../datatypes/Coord.ts";
import { spaceGetFENString, spaceIsEmpty } from "../../datatypes/Space.ts";

const BAR = "   +------------------------+\n";
const FILES = "     a  b  c  d  e  f  g  h";

/**
 * Inspired by the ASCII view from Chess.js:
 *
 * @param b
 */
export function boardToASCII(b: Board): string {
  let out = BAR;
  for (let rank = 7; rank >= 0; rank--) {
    let row = ` ${rank + 1} | `;
    for (let file = 0; file < 8; file++) {
      const idx = buildCoord(file, rank);
      const sp = b.get(idx);
      const space = file ? "  " : "";
      row += space + spaceIsEmpty(sp) ? "." : spaceGetFENString(sp);
    }
    out += row + " |\n";
  }
  return out + BAR + FILES;
}
