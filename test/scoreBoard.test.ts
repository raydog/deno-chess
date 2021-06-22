import { scoreBoard } from "../src/autoplayers/utils/evaluation/scoreBoard.ts";
import { ScoreSettings } from "../src/autoplayers/utils/evaluation/ScoreSettings.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../src/core/datatypes/PieceType.ts";
import { boardFromFEN } from "../src/core/logic/FEN/boardFromFEN.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Board Scoring > Material > White pawns", function () {
  const b = boardFromFEN("8/8/8/8/3P4/1P4P1/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, 3);
});

Deno.test("Board Scoring > Material > White bishops", function () {
  const b = boardFromFEN("8/8/8/8/5B2/1B6/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, 6);
});

Deno.test("Board Scoring > Material > White knights", function () {
  const b = boardFromFEN("8/8/8/8/8/8/8/1N4N1 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, 6);
});

Deno.test("Board Scoring > Material > White rooks", function () {
  const b = boardFromFEN("8/8/8/3R4/8/8/7R/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, 10);
});

Deno.test("Board Scoring > Material > White queens", function () {
  const b = boardFromFEN("6Q1/8/8/8/8/8/8/3Q4 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, 18);
});

Deno.test("Board Scoring > Material > White kings", function () {
  const b = boardFromFEN("8/8/8/8/8/8/8/4K3 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, 200);
});

Deno.test("Board Scoring > Material > Black pawns", function () {
  const b = boardFromFEN("8/5pp1/8/2p5/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, -3);
});

Deno.test("Board Scoring > Material > Black bishops", function () {
  const b = boardFromFEN("8/3bb3/8/8/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, -6);
});

Deno.test("Board Scoring > Material > Black knights", function () {
  const b = boardFromFEN("8/n7/7n/8/8/8/8/3n4 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, -9);
});

Deno.test("Board Scoring > Material > Black rooks", function () {
  const b = boardFromFEN("3r4/8/8/8/8/8/8/3r4 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, -10);
});

Deno.test("Board Scoring > Material > Black queens", function () {
  const b = boardFromFEN("3q4/8/8/8/8/8/8/7q w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, -18);
});

Deno.test("Board Scoring > Material > Black kings", function () {
  const b = boardFromFEN("4k3/8/8/8/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, -200);
});

Deno.test("Board Scoring > Material > Starting position", function () {
  const b = boardFromFEN(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, 0);
});

Deno.test("Board Scoring > Material > Sloppy Exchanges", function () {
  const b = boardFromFEN(
    "r3k2r/ppp2ppp/8/2b1p2n/3qP1b1/1B1P4/PP3PPP/RNB1K2R w KQkq - 0 1",
  );
  const score = scoreBoard(
    b,
    _settings({
      Material: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 3,
        [PIECETYPE_KNIGHT]: 3,
        [PIECETYPE_ROOK]: 5,
        [PIECETYPE_QUEEN]: 9,
        [PIECETYPE_KING]: 200,
      },
    }),
  );
  asserts.assertEquals(score, -9);
});

Deno.test("Board Scoring > Mobility > White piece", function () {
  const b = boardFromFEN("8/8/8/8/8/8/8/2Q5 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Mobility: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 1,
        [PIECETYPE_KNIGHT]: 1,
        [PIECETYPE_ROOK]: 1,
        [PIECETYPE_QUEEN]: 1,
        [PIECETYPE_KING]: 1,
      },
    }),
  );
  asserts.assertEquals(score, 21);
});

Deno.test("Board Scoring > Mobility > Black piece", function () {
  const b = boardFromFEN("1r1bb1r1/8/8/8/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Mobility: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 1,
        [PIECETYPE_KNIGHT]: 1,
        [PIECETYPE_ROOK]: 1,
        [PIECETYPE_QUEEN]: 1,
        [PIECETYPE_KING]: 1,
      },
    }),
  );
  asserts.assertEquals(score, -32);
});

Deno.test("Board Scoring > Mobility > White pawn", function () {
  const b = boardFromFEN("8/8/8/8/3P4/8/1PP5/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Mobility: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 1,
        [PIECETYPE_KNIGHT]: 1,
        [PIECETYPE_ROOK]: 1,
        [PIECETYPE_QUEEN]: 1,
        [PIECETYPE_KING]: 1,
      },
    }),
  );
  asserts.assertEquals(score, 3);
});

Deno.test("Board Scoring > Mobility > Black pawn", function () {
  const b = boardFromFEN("8/5pp1/8/1p6/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      Mobility: {
        [PIECETYPE_PAWN]: 1,
        [PIECETYPE_BISHOP]: 1,
        [PIECETYPE_KNIGHT]: 1,
        [PIECETYPE_ROOK]: 1,
        [PIECETYPE_QUEEN]: 1,
        [PIECETYPE_KING]: 1,
      },
    }),
  );
  asserts.assertEquals(score, -3);
});

Deno.test("Board Scoring > Pawn in center > Inside in opening", function () {
  const b = boardFromFEN("8/8/8/8/4P3/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 0,
      PawnCenter: 1,
    }),
  );
  asserts.assertEquals(score, 1);
});

Deno.test("Board Scoring > Pawn in center > Black in opening", function () {
  const b = boardFromFEN("8/8/8/4p3/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 0,
      PawnCenter: 1,
    }),
  );
  asserts.assertEquals(score, -1);
});

Deno.test("Board Scoring > Pawn in center > Inside in endgame", function () {
  const b = boardFromFEN("8/8/8/8/4P3/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      PawnCenter: 1,
    }),
  );
  asserts.assertEquals(score, 0);
});

Deno.test("Board Scoring > Pawn in center > Outside", function () {
  const b = boardFromFEN("8/8/8/2P5/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 0,
      PawnCenter: 1,
    }),
  );
  asserts.assertEquals(score, 0);
});

Deno.test("Board Scoring > Outer ring > Opening", function () {
  const b = boardFromFEN("8/8/4Q3/2P2R2/8/4B3/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 0,
      PieceOuterCenter: 1,
    }),
  );
  asserts.assertEquals(score, 4);
});

Deno.test("Board Scoring > Outer ring > Black in opening", function () {
  const b = boardFromFEN("8/8/3b4/8/8/5n2/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 0,
      PieceOuterCenter: 1,
    }),
  );
  asserts.assertEquals(score, -2);
});

Deno.test("Board Scoring > Outer ring > Endgame", function () {
  const b = boardFromFEN("8/8/4Q3/2P2R2/8/4B3/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      PieceOuterCenter: 1,
    }),
  );
  asserts.assertEquals(score, 0);
});

Deno.test("Board Scoring > Center attacks > Knight", function () {
  const b = boardFromFEN("8/8/8/8/8/2N5/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 0,
      PieceCenterAttack: 1,
    }),
  );
  asserts.assertEquals(score, 2);
});

Deno.test("Board Scoring > Center attacks > Rook", function () {
  const b = boardFromFEN("8/8/8/8/R7/8/8/4R3 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 0,
      PieceCenterAttack: 1,
    }),
  );
  asserts.assertEquals(score, 4);
});

Deno.test("Board Scoring > Center attacks > Black rook", function () {
  const b = boardFromFEN("3rr3/8/8/8/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 0,
      PieceCenterAttack: 1,
    }),
  );
  asserts.assertEquals(score, -4);
});

Deno.test("Board Scoring > Center attacks > Endgame", function () {
  const b = boardFromFEN("8/8/8/8/R7/8/8/4R3 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      PieceCenterAttack: 1,
    }),
  );
  asserts.assertEquals(score, 0);
});

Deno.test("Board Scoring > Center attacks > Endgame", function () {
  const b = boardFromFEN("8/8/8/8/R7/8/8/4R3 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      PieceCenterAttack: 1,
    }),
  );
  asserts.assertEquals(score, 0);
});

Deno.test("Board Scoring > Endgame king > White edge", function () {
  const b = boardFromFEN("8/8/8/8/8/8/8/1K6 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      KingEndgameEdge: 1,
    }),
  );
  asserts.assertEquals(score, 1);
});

Deno.test("Board Scoring > Endgame king > Black edge", function () {
  const b = boardFromFEN("7k/8/8/8/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      KingEndgameEdge: 1,
    }),
  );
  asserts.assertEquals(score, -1);
});

Deno.test("Board Scoring > Endgame king > Outer ring", function () {
  const b = boardFromFEN("8/8/8/8/2K5/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      KingEndgameOuterCenter: 1,
    }),
  );
  asserts.assertEquals(score, 1);
});

Deno.test("Board Scoring > Endgame king > Black outer ring", function () {
  const b = boardFromFEN("8/8/8/8/5k2/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      KingEndgameOuterCenter: 1,
    }),
  );
  asserts.assertEquals(score, -1);
});

Deno.test("Board Scoring > Endgame king > Center", function () {
  const b = boardFromFEN("8/8/8/3K4/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      KingEndgameCenter: 1,
    }),
  );
  asserts.assertEquals(score, 1);
});

Deno.test("Board Scoring > Endgame king > Black center", function () {
  const b = boardFromFEN("8/8/8/4k3/8/8/8/8 w - - 0 1");
  const score = scoreBoard(
    b,
    _settings({
      PhaseOverride: 2,
      KingEndgameCenter: 1,
    }),
  );
  asserts.assertEquals(score, -1);
});

// Tests involve lots of settings overrides, so this'll make it easier:
function _settings(overrides: Partial<ScoreSettings>): ScoreSettings {
  return {
    Material: {
      [PIECETYPE_PAWN]: 0,
      [PIECETYPE_BISHOP]: 0,
      [PIECETYPE_KNIGHT]: 0,
      [PIECETYPE_ROOK]: 0,
      [PIECETYPE_QUEEN]: 0,
      [PIECETYPE_KING]: 0,
    },
    Mobility: {
      [PIECETYPE_PAWN]: 0,
      [PIECETYPE_BISHOP]: 0,
      [PIECETYPE_KNIGHT]: 0,
      [PIECETYPE_ROOK]: 0,
      [PIECETYPE_QUEEN]: 0,
      [PIECETYPE_KING]: 0,
    },
    PawnCenter: 0,
    PawnCenterAttack: 0,
    MinorCenter: 0,
    QueenCenter: 0,
    PieceCenterAttack: 0,
    PieceOuterCenter: 0,
    KingEndgameEdge: 0,
    KingEndgameOuterCenter: 0,
    KingEndgameCenter: 0,
    ...overrides,
  };
}
