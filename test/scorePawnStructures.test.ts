import { scorePawnStructures } from "../src/autoplayers/utils/evaluation/scorePawnStructure.ts";
import { ScoreSettings } from "../src/autoplayers/utils/evaluation/ScoreSettings.ts";
import { boardFromFEN } from "../src/core/logic/FEN/boardFromFEN.ts";
import { asserts } from "../testDeps.ts";

const settings: ScoreSettings = {
  Material: {},

  Mobility: {
    MoveScore: 10,
  },

  PawnStructure: {
    IsolatedPawn: 0,
    DoubledPawn: 0,
    PastPawn: 0,
    PawnSupport: 0,
    PawnAdvancement: 0,
  },

  Random: {
    Range: 0,
    BookOdds: 1,
  },
};

Deno.test("Board Scoring > Pawn Structures > White doubled pawns", function () {
  const b = boardFromFEN(
    "8/1P1P1P2/P2P1PP1/PP2P1P1/P1P1PP1P/1P4P1/1PP1P1P1/8 w - - 0 1",
  );
  const score = scorePawnStructures(
    b,
    _config({
      DoubledPawn: -10,
    }),
  );
  asserts.assertEquals(score, -80);
});

Deno.test("Board Scoring > Pawn Structures > Black doubled pawns", function () {
  const b = boardFromFEN(
    "8/1pp2p2/p1p2p2/p1pp2pp/1p3p2/1p3p1p/p1p2p2/8 w - - 0 1",
  );
  const score = scorePawnStructures(
    b,
    _config({
      DoubledPawn: -10,
    }),
  );
  asserts.assertEquals(score, 70);
});

Deno.test("Board Scoring > Pawn Structures > White pawn support", function () {
  const b = boardFromFEN("8/8/6PP/6P1/2PP4/1P2P3/P7/8 w - - 0 1");
  const score = scorePawnStructures(
    b,
    _config({
      PawnSupport: 10,
    }),
  );
  asserts.assertEquals(score, 40);
});

Deno.test("Board Scoring > Pawn Structures > Black pawn support", function () {
  const b = boardFromFEN("8/p7/1p2p2p/2pp3p/5p2/8/8/8 w - - 0 1");
  const score = scorePawnStructures(
    b,
    _config({
      PawnSupport: 10,
    }),
  );
  asserts.assertEquals(score, -30);
});

Deno.test("Board Scoring > Pawn Structures > White pawn advancement", function () {
  const b = boardFromFEN("8/6P1/8/8/1P6/8/P7/8 w - - 0 1");
  const score = scorePawnStructures(
    b,
    _config({
      PawnAdvancement: 10,
    }),
  );
  asserts.assertEquals(score, 70);
});

Deno.test("Board Scoring > Pawn Structures > Black pawn advancement", function () {
  const b = boardFromFEN("8/p7/7p/2p5/8/8/4p3/8 w - - 0 1");
  const score = scorePawnStructures(
    b,
    _config({
      PawnAdvancement: 10,
    }),
  );
  asserts.assertEquals(score, -80);
});

function _config(
  pawnConfig: Partial<ScoreSettings["PawnStructure"]>,
): ScoreSettings {
  return {
    ...settings,
    PawnStructure: {
      ...settings.PawnStructure,
      ...pawnConfig,
    },
  };
}
