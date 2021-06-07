import { Board } from "../src/core/datatypes/Board.ts";
import { coordFromAN } from "../src/core/datatypes/Coord.ts";
import { createFullMove, createSimpleMove } from "../src/core/datatypes/Move.ts";
import {
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
} from "../src/core/datatypes/PieceType.ts";
import {
  SPACE_EMPTY,
  spaceGetType,
  spaceHasMoved,
} from "../src/core/datatypes/Space.ts";
import { buildStandardBoard } from "../src/core/logic/boardLayouts/standard.ts";
import { performMove } from "../src/core/logic/performMove.ts";
import { asserts } from "../testDeps.ts";

// Shorthand:
const an = coordFromAN;

const move = (b: Board, from: string, to: string, ep?: string) =>
  ep
    ? createFullMove(
      b.get(an(from)),
      an(from),
      an(to),
      0,
      0,
      0,
      0,
      0,
      0,
      an(ep),
    )
    : createSimpleMove(b.get(an(from)), an(from), an(to));

Deno.test("Perform Move > Réti Opening", function () {
  const b = buildStandardBoard();

  performMove(
    b,
    move(b, "g1", "f3"),
  );

  asserts.assertEquals(b.get(an("g1")) === SPACE_EMPTY, true);
  asserts.assertEquals(spaceGetType(b.get(an("f3"))), PIECETYPE_KNIGHT);
  asserts.assertEquals(spaceHasMoved(b.get(an("f3"))), true);

  performMove(
    b,
    move(b, "d7", "d5", "d6"),
  );

  asserts.assertEquals(b.get(an("d7")) === SPACE_EMPTY, true);
  asserts.assertEquals(spaceGetType(b.get(an("d5"))), PIECETYPE_PAWN);
  asserts.assertEquals(spaceHasMoved(b.get(an("d5"))), true);
  asserts.assertEquals(b.current.ep, an("d6"));

  performMove(
    b,
    move(b, "c2", "c4", "c3"),
  );

  asserts.assertEquals(b.get(an("c2")) === SPACE_EMPTY, true);
  asserts.assertEquals(spaceGetType(b.get(an("c4"))), PIECETYPE_PAWN);
  asserts.assertEquals(spaceHasMoved(b.get(an("c4"))), true);
  asserts.assertEquals(b.current.ep, an("c3"));

  // console.log("\n\n" + debugBoard(b, []));
});

Deno.test("Perform Move > Sicilian defense", function () {
  const b = buildStandardBoard();

  performMove(
    b,
    move(b, "e2", "e4", "e3"),
  );

  asserts.assertEquals(b.get(an("e2")) === SPACE_EMPTY, true);
  asserts.assertEquals(spaceGetType(b.get(an("e4"))), PIECETYPE_PAWN);
  asserts.assertEquals(spaceHasMoved(b.get(an("e4"))), true);
  asserts.assertEquals(b.current.ep, an("e3"));

  performMove(
    b,
    move(b, "c7", "c5", "c6"),
  );

  asserts.assertEquals(b.get(an("c7")) === SPACE_EMPTY, true);
  asserts.assertEquals(spaceGetType(b.get(an("c5"))), PIECETYPE_PAWN);
  asserts.assertEquals(spaceHasMoved(b.get(an("c5"))), true);
  asserts.assertEquals(b.current.ep, an("c6"));

  performMove(
    b,
    move(b, "g1", "f3"),
  );

  asserts.assertEquals(b.current.ep, 0x88);
  asserts.assertEquals(b.get(an("g1")) === SPACE_EMPTY, true);
  asserts.assertEquals(spaceGetType(b.get(an("f3"))), PIECETYPE_KNIGHT);
  asserts.assertEquals(spaceHasMoved(b.get(an("f3"))), true);

  // console.log("\n\n" + debugBoard(b, []));
});
