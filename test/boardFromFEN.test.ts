import { createFullMove } from "../src/datatypes/Move.ts";
import { boardToFEN } from "../src/logic/FEN/boardToFEN.ts";
import { buildStandardBoard } from "../src/logic/boardLayouts/standard.ts";
import { performMove } from "../src/logic/performMove.ts";
import { asserts } from "../testDeps.ts";
import { boardFromFEN } from "../src/logic/FEN/boardFromFEN.ts";
import { boardRenderASCII } from "../src/logic/boardRenderASCII.ts";
import { Color } from "../src/datatypes/Color.ts";
import { castleMapGetFile } from "../src/datatypes/CastleMap.ts";

// Note: These tests seem arbitrary, but they're the literal examples shown in the spec, so may as well

// Testbook starting position:
Deno.test("FEN > Input > Starting position", function () {
  const b = boardFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  asserts.assertEquals(
    boardRenderASCII(b, false).split("\n"),
    [
      "     a  b  c  d  e  f  g  h    ",
      "   +------------------------+  ",
      " 8 | r  n  b  q  k  b  n  r | 8",
      " 7 | p  p  p  p  p  p  p  p | 7",
      " 6 |                        | 6",
      " 5 |                        | 5",
      " 4 |                        | 4",
      " 3 |                        | 3",
      " 2 | P  P  P  P  P  P  P  P | 2",
      " 1 | R  N  B  Q  K  B  N  R | 1",
      "   +------------------------+  ",
      "     a  b  c  d  e  f  g  h    " ,     
    ]
  );
});

// Generated by chess.js:
Deno.test("FEN > Input > Removes castling ability correctly", function () {
  const b = boardFromFEN("r1bqk2r/ppp2ppp/3p1n2/b7/2BQP3/2P5/P4PPP/RNB1K2R b Qkq - 1 10");
  asserts.assertEquals(
    boardRenderASCII(b, false).split("\n"),
    [
      "     a  b  c  d  e  f  g  h    ",
      "   +------------------------+  ",
      " 8 | r     b  q  k        r | 8",
      " 7 | p  p  p        p  p  p | 7",
      " 6 |          p     n       | 6",
      " 5 | b                      | 5",
      " 4 |       B  Q  P          | 4",
      " 3 |       P                | 3",
      " 2 | P              P  P  P | 2",
      " 1 | R  N  B     K        R | 1",
      "   +------------------------+  ",
      "     a  b  c  d  e  f  g  h    " ,     
    ]
  );
  asserts.assertEquals(b.getTurn(), Color.Black);
  const castles = b.getCastles();
  asserts.assertEquals(castleMapGetFile(castles, Color.White, false), 0);
  asserts.assertEquals(castleMapGetFile(castles, Color.White, true), 0x8); // << Moved
  asserts.assertEquals(castleMapGetFile(castles, Color.Black, false), 0);
  asserts.assertEquals(castleMapGetFile(castles, Color.Black, true), 7);
});

// Generated by chess.com:
Deno.test("FEN > Input > Initializes a stalemate", function () {
  const b = boardFromFEN("5bnr/4p1pq/4Qpkr/7p/7P/4P3/PPPP1PP1/RNB1KBNR b KQ - 2 10");
  asserts.assertEquals(
    boardRenderASCII(b, false).split("\n"),
    [
      "     a  b  c  d  e  f  g  h    ",
      "   +------------------------+  ",
      " 8 |                b  n  r | 8",
      " 7 |             p     p  q | 7",
      " 6 |             Q  p  k  r | 6",
      " 5 |                      p | 5",
      " 4 |                      P | 4",
      " 3 |             P          | 3",
      " 2 | P  P  P  P     P  P    | 2",
      " 1 | R  N  B     K  B  N  R | 1",
      "   +------------------------+  ",
      "     a  b  c  d  e  f  g  h    " ,
    ]
  );
  asserts.assertEquals(b.getTurn(), Color.Black);
  const castles = b.getCastles();
  asserts.assertEquals(castleMapGetFile(castles, Color.White, false), 0);
  asserts.assertEquals(castleMapGetFile(castles, Color.White, true), 7);
  asserts.assertEquals(castleMapGetFile(castles, Color.Black, false), 0x8);
  asserts.assertEquals(castleMapGetFile(castles, Color.Black, true), 0x8);
  // TODO: Make sure in stalemate...
});

