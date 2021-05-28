import { Board } from "../../src/datatypes/Board.ts";
import { buildCoord } from "../../src/datatypes/Coord.ts";
import { Move } from "../../src/datatypes/Move.ts";
import { spaceGetFENString } from "../../src/datatypes/Space.ts";
import { moveAndCheckResults } from "../../src/logic/moveResults.ts";

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
export function debugBoard(b: Board, moves: Move[], fullCalc = false): string {
  let out = FILES + HORIZ;

  for (let rank = 7; rank >= 0; rank--) {
    let row = ` ${rank + 1} |`;
    for (let file = 0; file < 8; file++) {
      const idx = buildCoord(file, rank);
      const sp = b.get(idx);
      const mid = spaceGetFENString(sp);
      const here = moves.filter((move) => move.dest === idx);
      const temp = _moveTemplate(b, here, fullCalc);
      row += temp.replace("@", mid) + "|";
    }
    out += `${row} ${rank + 1}\n${HORIZ}`;
  }
  return out + FILES;
}

function _moveTemplate(b: Board, moves: Move[], fullCalc: boolean): string {
  // Normal:
  if (!moves.length) return " @ ";

  if (fullCalc) {
    const results = moves.map((move) => moveAndCheckResults(b, move));

    // Any checkmates?
    if (results.some((move) => !move.enemyCanMove && move.enemyInCheck)) {
      return "#@#";
    }

    // Any checks at least?
    if (results.some((move) => move.enemyInCheck)) {
      return "+@+";
    }

    // Uh oh! Any stalemates?
    if (results.some((move) => !move.enemyCanMove && !move.enemyInCheck)) {
      return "%@%";
    }
  }

  // Else, it's a move, but not a special-cased one:
  return ".@.";
}
