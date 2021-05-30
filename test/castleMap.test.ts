import { buildCastleMap, castleMapKingMoved, castleMapRookMoved, castleMapGetFile } from "../src/datatypes/CastleMap.ts";
import { Color } from "../src/datatypes/Color.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Castle Map > Initialize standard board", function () {
  const map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  asserts.assertEquals(map, 0x0707);
});

Deno.test("Castle Map > Move white king", function () {
  let map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  map = castleMapKingMoved(map, Color.White);
  asserts.assertEquals(map, 0x0788);
});

Deno.test("Castle Map > Move black king", function () {
  let map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  map = castleMapKingMoved(map, Color.Black);
  asserts.assertEquals(map, 0x8807);
});

Deno.test("Castle Map > Move white kingside rook", function () {
  let map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  map = castleMapRookMoved(map, 0x07);
  asserts.assertEquals(map, 0x0708);
});

Deno.test("Castle Map > Move white queenside rook", function () {
  let map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  map = castleMapRookMoved(map, 0x00);
  asserts.assertEquals(map, 0x0787);
});

Deno.test("Castle Map > Move white unknown rook", function () {
  let map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  map = castleMapRookMoved(map, 0x03);
  asserts.assertEquals(map, 0x0707);
});

Deno.test("Castle Map > Move black kingside rook", function () {
  let map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  map = castleMapRookMoved(map, 0x77);
  asserts.assertEquals(map, 0x0807);
});

Deno.test("Castle Map > Move black queenside rook", function () {
  let map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  map = castleMapRookMoved(map, 0x70);
  asserts.assertEquals(map, 0x8707);
});

Deno.test("Castle Map > Move black unknown rook", function () {
  let map = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  map = castleMapRookMoved(map, 0x73);
  asserts.assertEquals(map, 0x0707);
});

Deno.test("Castle Map > Fetch white kingside eligibility", function () {
  const map = buildCastleMap(0x01, 0x02, 0x73, 0x74);
  const rank = castleMapGetFile(map, Color.White, true);
  asserts.assertEquals(rank, 0x2);
});

Deno.test("Castle Map > Fetch white queenside eligibility", function () {
  const map = buildCastleMap(0x01, 0x02, 0x73, 0x74);
  const rank = castleMapGetFile(map, Color.White, false);
  asserts.assertEquals(rank, 0x1);
});

Deno.test("Castle Map > Fetch black kingside eligibility", function () {
  const map = buildCastleMap(0x01, 0x02, 0x73, 0x74);
  const rank = castleMapGetFile(map, Color.Black, true);
  asserts.assertEquals(rank, 0x4);
});

Deno.test("Castle Map > Fetch black queenside eligibility", function () {
  const map = buildCastleMap(0x01, 0x02, 0x73, 0x74);
  const rank = castleMapGetFile(map, Color.Black, false);
  asserts.assertEquals(rank, 0x3);
});
