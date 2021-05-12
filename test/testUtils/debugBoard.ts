import { Board } from "../../src/datatypes/Board.ts";
import { buildCoord, Coord } from "../../src/datatypes/Coord.ts";
import { spaceGetFENString } from "../../src/datatypes/Space.ts";

const FILES = "     A   B   C   D   E   F   G   H  \n";
const HORIZ = "   +" + "---+".repeat(8) + "\n";

/**
 * Barfs out the current board state, annotated with a move list.
 * 
 * Returns as a string, so it can be integrated into error messages.
 * 
 * @param b 
 * @param list 
 */
export function debugBoard(b: Board, list: Coord[]): string {
  let out = FILES + HORIZ;
  const spots = new Set(list);

  for (let rank = 7; rank >= 0; rank--) {
    let row = ` ${rank + 1} |`;
    for (let file = 0; file < 8; file++) {
      const idx = buildCoord(file, rank);
      const sp = b.get(idx);
      const mid = spaceGetFENString(sp);
      const full = spots.has(idx) ? `<${mid}>` : ` ${mid} `;
      row += full + "|";
    }
    out += `${row} ${rank + 1}\n${HORIZ}`;
  }
  return out + FILES;
}
