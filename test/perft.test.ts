import { Board } from "../src/core/datatypes/Board.ts";
import { buildStandardBoard } from "../src/core/logic/boardLayouts/standard.ts";
import { boardFromFEN } from "../src/core/logic/FEN/boardFromFEN.ts";
import { perft } from "../src/core/logic/perft.ts";
import { asserts } from "../testDeps.ts";

type PerftDef = {
  name: string,
  board: Board,
  tests: { depth: number, shouldBe: number }[]
}

// To test all positions, bump this to Infinity. However, most engine errors are caught before the highest depths
// anyways, so we skip tests that have a count beyond this number of nodes:
const SLOW_CUTOFF = 2_000_000;

// These setups are from chessprogramming.org/Perft_Results

const PERFT_TESTS: PerftDef[] = [
  {
    name: "Initial position",
    board: buildStandardBoard(),
    tests: [
      { depth: 1, shouldBe: 20 },
      { depth: 2, shouldBe: 400 },
      { depth: 3, shouldBe: 8902 },
      { depth: 4, shouldBe: 197281 },
      { depth: 5, shouldBe: 4865609 },
    ]
  },

  {
    name: "Kiwipete",
    board: boardFromFEN("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"),
    tests: [
      { depth: 1, shouldBe: 48 },
      { depth: 2, shouldBe: 2039 },
      { depth: 3, shouldBe: 97862 },
      { depth: 4, shouldBe: 4085603 },
    ]
  },

  {
    name: "Position 3",
    board: boardFromFEN("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"),
    tests: [
      { depth: 1, shouldBe: 14 },
      { depth: 2, shouldBe: 191 },
      { depth: 3, shouldBe: 2812 },
      { depth: 4, shouldBe: 43238 },
      { depth: 5, shouldBe: 674624 },
    ]
  },

  {
    name: "Position 4",
    board: boardFromFEN("r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"),
    tests: [
      { depth: 1, shouldBe: 6 },
      { depth: 2, shouldBe: 264 },
      { depth: 3, shouldBe: 9467 },
      { depth: 4, shouldBe: 422333 },
    ]
  },

  {
    name: "Position 5",
    board: boardFromFEN("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"),
    tests: [
      { depth: 1, shouldBe: 44 },
      { depth: 2, shouldBe: 1486 },
      { depth: 3, shouldBe: 62379 },
      { depth: 4, shouldBe: 2103487 },
      { depth: 5, shouldBe: 89941194 },
    ]
  },

  {
    name: "Position 6",
    board: boardFromFEN("r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"),
    tests: [
      { depth: 1, shouldBe: 46 },
      { depth: 2, shouldBe: 2079 },
      { depth: 3, shouldBe: 89890 },
      { depth: 4, shouldBe: 3894594 },
      { depth: 5, shouldBe: 164075551 }, // << Push this position a little further, since it's been known to find bugs
    ]
  },
];

for (const { name, board, tests } of PERFT_TESTS) {
  for (const { depth, shouldBe } of tests) {
    Deno.test({
      name: `Perft > ${name} > Depth ${depth}`,
      ignore: shouldBe > SLOW_CUTOFF,
      fn() {
        const count = perft(board, depth);
        asserts.assertEquals(count, shouldBe);
      }
    });
  }
}
