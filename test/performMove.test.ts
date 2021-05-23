import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { Coord, coordFromAN } from "../src/datatypes/Coord.ts";
import { createFullMove, createSimpleMove } from "../src/datatypes/Move.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import {
  encodePieceSpace,
  spaceEnPassant,
  spaceGetType,
  spaceHasMoved,
  spaceIsEmpty,
} from "../src/datatypes/Space.ts";
import { buildStandardBoard } from "../src/logic/boardLayouts/standard.ts";
import { performMove } from "../src/logic/performMove.ts";
import { asserts } from "../testDeps.ts";
// import { debugBoard } from "./testUtils/debugBoard.ts";

// Shorthand:
const an = coordFromAN;

const move = (b: Board, from: string, to: string, ep = false) =>
  ep
    ? createFullMove(b.get(an(from)), an(from), an(to), 0, 0, 0, 0, 0, 0, true)
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
    move(b, "d7", "d5", true),
  );

  asserts.assertEquals(spaceIsEmpty(b.get(an("d7"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("d5"))), PieceType.Pawn);
  asserts.assertEquals(spaceHasMoved(b.get(an("d5"))), true);
  asserts.assertEquals(spaceEnPassant(b.get(an("d5"))), true);

  performMove(
    b,
    move(b, "c2", "c4", true),
  );

  asserts.assertEquals(spaceEnPassant(b.get(an("d5"))), false);
  asserts.assertEquals(spaceIsEmpty(b.get(an("c2"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("c4"))), PieceType.Pawn);
  asserts.assertEquals(spaceHasMoved(b.get(an("c4"))), true);
  asserts.assertEquals(spaceEnPassant(b.get(an("c4"))), true);

  // console.log("\n\n" + debugBoard(b, []));
});

Deno.test("Perform Move > Sicilian defense", function () {
  const b = buildStandardBoard();

  performMove(
    b,
    move(b, "e2", "e4", true),
  );

  asserts.assertEquals(spaceIsEmpty(b.get(an("e2"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("e4"))), PieceType.Pawn);
  asserts.assertEquals(spaceHasMoved(b.get(an("e4"))), true);
  asserts.assertEquals(spaceEnPassant(b.get(an("e4"))), true);

  performMove(
    b,
    move(b, "c7", "c5", true),
  );

  asserts.assertEquals(spaceEnPassant(b.get(an("e4"))), false);
  asserts.assertEquals(spaceIsEmpty(b.get(an("c7"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("c5"))), PieceType.Pawn);
  asserts.assertEquals(spaceHasMoved(b.get(an("c5"))), true);
  asserts.assertEquals(spaceEnPassant(b.get(an("c5"))), true);

  performMove(
    b,
    move(b, "g1", "f3"),
  );

  asserts.assertEquals(spaceEnPassant(b.get(an("c5"))), false);
  asserts.assertEquals(spaceIsEmpty(b.get(an("g1"))), true);
  asserts.assertEquals(spaceGetType(b.get(an("f3"))), PieceType.Knight);
  asserts.assertEquals(spaceHasMoved(b.get(an("f3"))), true);
  asserts.assertEquals(spaceEnPassant(b.get(an("f3"))), false);

  // console.log("\n\n" + debugBoard(b, []));
});
