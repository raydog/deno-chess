import { Board } from "../../src/datatypes/Board.ts";
import { Coord, coordToAN } from "../../src/datatypes/Coord.ts";
import { asserts } from "../../testDeps.ts";
import { debugBoard } from "./debugBoard.ts";

/**
 * Asserts that the list of valid moves are equal to the given versions. Order doesn't matter.
 * 
 * @param moves 
 * @param shouldBe 
 */
export function assertMoves(b: Board, moves: Coord[], shouldBe: string[]) {
  const got = moves.map(coordToAN).sort();

  try {
    asserts.assertEquals(got, shouldBe.sort());
  } catch (ex) {
    ex.message += "\n" + debugBoard(b, moves);
    throw ex;
  }
}
