import { Board } from "../src/core/datatypes/Board.ts";
import {
  Color,
  COLOR_BLACK,
  COLOR_WHITE,
} from "../src/core/datatypes/Color.ts";
import { buildCoord } from "../src/core/datatypes/Coord.ts";
import {
  PieceType,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../src/core/datatypes/PieceType.ts";
import {
  encodePieceSpace,
  Space,
  spaceGetColor,
  spaceGetType,
} from "../src/core/datatypes/Space.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Board > Can set pieces", function () {
  const b = new Board();
  b.set(
    buildCoord(2, 2),
    encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, false),
  );
  _assertSpace(b.get(buildCoord(2, 2)), PIECETYPE_ROOK, COLOR_WHITE);
});

Deno.test("Board > Can add overlays", function () {
  const b = new Board();

  b.set(
    buildCoord(2, 2),
    encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, false),
  );
  _assertSpace(b.get(buildCoord(2, 2)), PIECETYPE_ROOK, COLOR_WHITE);

  b.save();
  b.set(
    buildCoord(2, 2),
    encodePieceSpace(PIECETYPE_QUEEN, COLOR_BLACK, false),
  );
  _assertSpace(b.get(buildCoord(2, 2)), PIECETYPE_QUEEN, COLOR_BLACK);
});

Deno.test("Board > Can remove overlays", function () {
  const b = new Board();

  b.set(
    buildCoord(2, 2),
    encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, false),
  );
  _assertSpace(b.get(buildCoord(2, 2)), PIECETYPE_ROOK, COLOR_WHITE);

  b.save();
  b.set(buildCoord(2, 2), 0);
  asserts.equal(b.get(buildCoord(2, 2)), 0);

  b.restore();
  _assertSpace(b.get(buildCoord(2, 2)), PIECETYPE_ROOK, COLOR_WHITE);
});

function _assertSpace(sp: Space, t: PieceType, c: Color) {
  asserts.assertEquals(spaceGetType(sp), t);
  asserts.assertEquals(spaceGetColor(sp), c);
}
