import { Board } from "../../src/core/datatypes/Board.ts";
import { Move } from "../../src/core/datatypes/Move.ts";
import { moveToSAN } from "../../src/core/logic/moveFormats/moveToSAN.ts";
import { moveAndCheckResults } from "../../src/core/logic/moveResults.ts";
import { asserts } from "../../testDeps.ts";
import { debugBoard } from "./debugBoard.ts";

/**
 * Asserts that the list of valid moves are equal to the given versions. Order doesn't matter.
 *
 * @param moves
 * @param shouldBe
 */
export function assertMoves(
  b: Board,
  moves: Move[],
  shouldBe: string[],
  fullCalc = false,
) {
  // Note: moves is often only a single piece's moves, but the moveToSAN logic wants the list of ALL pieces. That
  // should be fine, however. It just means the departure coord won't be as specific as it could be, but that wasn't
  // the purpose of those tests anyways.

  // Howver, we *will* compute the move consequences, since it'll result in better check annotations:
  const got = moves
    .map((move) =>
      moveToSAN(
        moves,
        move,
        fullCalc ? moveAndCheckResults(b, move) : undefined,
      )
    )
    .sort();

  try {
    asserts.assertEquals(got, shouldBe.sort());
  } catch (ex) {
    ex.message += "\n" + debugBoard(b, moves, fullCalc);
    throw ex;
  }
}
