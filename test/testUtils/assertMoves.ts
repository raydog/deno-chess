import { Board } from "../../src/datatypes/Board.ts";
import { Move } from "../../src/datatypes/Move.ts";
import { moveToAN } from "../../src/logic/moveFormats/algebraicNotation.ts";
import { asserts } from "../../testDeps.ts";
import { debugBoard } from "./debugBoard.ts";

/**
 * Asserts that the list of valid moves are equal to the given versions. Order doesn't matter.
 *
 * @param moves
 * @param shouldBe
 */
export function assertMoves(b: Board, moves: Move[], shouldBe: string[]) {
  const got = moves.map(moveToAN).sort();

  try {
    asserts.assertEquals(got, shouldBe.sort());
  } catch (ex) {
    ex.message += "\n" + debugBoard(b, moves);
    throw ex;
  }
}
