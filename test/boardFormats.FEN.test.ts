import { boardRenderFEN } from "../src/logic/boardFormats/boardRenderFEN.ts";
import { buildStandardBoard } from "../src/logic/boardLayouts/standard.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Board Formats > FEN > Starting position", function () {
  const b = buildStandardBoard();
  const fen = boardRenderFEN(b);
  asserts.assertEquals(fen, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
});
