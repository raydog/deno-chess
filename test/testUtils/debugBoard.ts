import { Board } from "../../src/datatypes/Board.ts";
import { buildCoord } from "../../src/datatypes/Coord.ts";
import { Move } from "../../src/datatypes/Move.ts";
import { spaceGetFENString } from "../../src/datatypes/Space.ts";

const FILES = "     A   B   C   D   E   F   G   H  \n";
const HORIZ = "   +" + "---+".repeat(8) + "\n";

/**
 * Barfs out the current board state, annotated with a move list.
 *
 * Annotations: +P+ (check), #P# (checkmate), %P% (stalemate)
 *
 * Returns as a string, so it can be integrated into error messages.
 *
 * @param b
 * @param list
 */
export function debugBoard(b: Board, moves: Move[]): string {
  let out = FILES + HORIZ;

  for (let rank = 7; rank >= 0; rank--) {
    let row = ` ${rank + 1} |`;
    for (let file = 0; file < 8; file++) {
      const idx = buildCoord(file, rank);
      const sp = b.get(idx);
      const mid = spaceGetFENString(sp);
      const here = moves.filter((move) => move.dest === idx);
      const temp = _moveTemplate(here);
      row += temp.replace("@", mid) + "|";
    }
    out += `${row} ${rank + 1}\n${HORIZ}`;
  }
  return out + FILES;
}

function _moveTemplate(moves: Move[]): string {
  // Normal:
  if (!moves.length) return " @ ";

  // Any checkmates?
  if (moves.some((move) => move.enemyHasMove === false && move.check)) {
    return "#@#";
  }

  // Any checks at least?
  if (moves.some((move) => move.check)) {
    return "+@+";
  }

  // Uh oh! Any stalemates?
  if (moves.some((move) => move.enemyHasMove === false && !move.check)) {
    return "%@%";
  }

  // Else, it's a move, but not a special-cased one:
  return ".@.";
}
