import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { buildCoord } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import {
  encodePieceSpace,
  Space,
  spaceGetColor,
  spaceGetType,
} from "../src/datatypes/Space.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Board > Can set pieces", function () {
  const b = new Board();
  b.set(
    buildCoord(2, 2),
    encodePieceSpace(PieceType.Rook, Color.White, false, false),
  );
  _assertSpace(b.get(buildCoord(2, 2)), PieceType.Rook, Color.White);
});

Deno.test("Board > Can add overlays", function () {
  const b = new Board();

  b.set(
    buildCoord(2, 2),
    encodePieceSpace(PieceType.Rook, Color.White, false, false),
  );
  _assertSpace(b.get(buildCoord(2, 2)), PieceType.Rook, Color.White);

  b.save();
  b.set(
    buildCoord(2, 2),
    encodePieceSpace(PieceType.Queen, Color.Black, false, false),
  );
  _assertSpace(b.get(buildCoord(2, 2)), PieceType.Queen, Color.Black);
});

Deno.test("Board > Can remove overlays", function () {
  const b = new Board();

  b.set(
    buildCoord(2, 2),
    encodePieceSpace(PieceType.Rook, Color.White, false, false),
  );
  _assertSpace(b.get(buildCoord(2, 2)), PieceType.Rook, Color.White);

  b.save();
  b.set(buildCoord(2, 2), 0);
  asserts.equal(b.get(buildCoord(2, 2)), 0);

  b.restore();
  _assertSpace(b.get(buildCoord(2, 2)), PieceType.Rook, Color.White);
});

function _assertSpace(sp: Space, t: PieceType, c: Color) {
  asserts.assertEquals(spaceGetType(sp), t);
  asserts.assertEquals(spaceGetColor(sp), c);
}
