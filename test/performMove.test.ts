import { Board } from "../src/datatypes/Board.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { createFullMove, createSimpleMove } from "../src/datatypes/Move.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import {
  spaceGetType,
  spaceHasMoved,
  spaceIsEmpty,
} from "../src/datatypes/Space.ts";
import { buildStandardBoard } from "../src/logic/boardLayouts/standard.ts";
import { performMove } from "../src/logic/performMove.ts";
import { asserts } from "../testDeps.ts";

// Shorthand:
const an = coordFromAN;

const move = (b: Board, from: string, to: string, ep?: string) =>
  ep
    ? createFullMove(b.get(an(from)), an(from), an(to), 0, 0, 0, 0, 0, 0, an(ep))
    : createSimpleMove(b.get(an(from)), an(from), an(to));

Deno.test("Perform Move > Réti Opening", function () {
  const b = buildStandardBoard();

  performMove(
    b,
    move(b, "g1", "f3"),
  );

  asserts.assertEquals(spaceIsEmpty(b.get(an("g1"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("f3"))), PieceType.Knight);
  asserts.assertEquals(spaceHasMoved(b.get(an("f3"))), true);

  performMove(
    b,
    move(b, "d7", "d5", "d6"),
  );

  asserts.assertEquals(spaceIsEmpty(b.get(an("d7"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("d5"))), PieceType.Pawn);
  asserts.assertEquals(spaceHasMoved(b.get(an("d5"))), true);
  asserts.assertEquals(b.getEnPassant(), an("d6"));

  performMove(
    b,
    move(b, "c2", "c4", "c3"),
  );

  asserts.assertEquals(spaceIsEmpty(b.get(an("c2"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("c4"))), PieceType.Pawn);
  asserts.assertEquals(spaceHasMoved(b.get(an("c4"))), true);
  asserts.assertEquals(b.getEnPassant(), an("c3"));

  // console.log("\n\n" + debugBoard(b, []));
});

Deno.test("Perform Move > Sicilian defense", function () {
  const b = buildStandardBoard();

  performMove(
    b,
    move(b, "e2", "e4", "e3"),
  );

  asserts.assertEquals(spaceIsEmpty(b.get(an("e2"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("e4"))), PieceType.Pawn);
  asserts.assertEquals(spaceHasMoved(b.get(an("e4"))), true);
  asserts.assertEquals(b.getEnPassant(), an("e3"));

  performMove(
    b,
    move(b, "c7", "c5", "c6"),
  );

  asserts.assertEquals(spaceIsEmpty(b.get(an("c7"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("c5"))), PieceType.Pawn);
  asserts.assertEquals(spaceHasMoved(b.get(an("c5"))), true);
  asserts.assertEquals(b.getEnPassant(), an("c6"));

  performMove(
    b,
    move(b, "g1", "f3"),
  );

  asserts.assertEquals(b.getEnPassant(), 0);
  asserts.assertEquals(spaceIsEmpty(b.get(an("g1"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("f3"))), PieceType.Knight);
  asserts.assertEquals(spaceHasMoved(b.get(an("f3"))), true);

  // console.log("\n\n" + debugBoard(b, []));
});
