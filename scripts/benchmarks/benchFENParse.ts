import { boardFromFEN } from "../../src/core/logic/FEN/boardFromFEN.ts";
import { bench, runBenchmarks } from "../../testDeps.ts";

// FENs from a gist of good perft starting points.
// https://gist.github.com/peterellisjones/8c46c28141c162d1d8a0f0badbc9cff9
const fens = [
  "r6r/1b2k1bq/8/8/7B/8/8/R3K2R b KQ - 3 2",
  "8/8/8/2k5/2pP4/8/B7/4K3 b - d3 0 3",
  "r1bqkbnr/pppppppp/n7/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 2 2",
  "r3k2r/p1pp1pb1/bn2Qnp1/2qPN3/1p2P3/2N5/PPPBBPPP/R3K2R b KQkq - 3 2",
  "2kr3r/p1ppqpb1/bn2Qnp1/3PN3/1p2P3/2N5/PPPBBPPP/R3K2R b KQ - 3 2",
  "rnb2k1r/pp1Pbppp/2p5/q7/2B5/8/PPPQNnPP/RNB1K2R w KQ - 3 9",
  "2r5/3pk3/8/2P5/8/2K5/8/8 w - - 5 4",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "3k4/3p4/8/K1P4r/8/8/8/8 b - - 0 1",
  "8/8/4k3/8/2p5/8/B2P2K1/8 w - - 0 1",
  "8/8/1k6/2b5/2pP4/8/5K2/8 b - d3 0 1",
  "5k2/8/8/8/8/8/8/4K2R w K - 0 1",
  "3k4/8/8/8/8/8/8/R3K3 w Q - 0 1",
  "r3k2r/1b4bq/8/8/8/8/7B/R3K2R w KQkq - 0 1",
  "r3k2r/8/3Q4/8/8/5q2/8/R3K2R b KQkq - 0 1",
  "2K2r2/4P3/8/8/8/8/8/3k4 w - - 0 1",
  "8/8/1P2K3/8/2n5/1q6/8/5k2 b - - 0 1",
  "4k3/1P6/8/8/8/8/K7/8 w - - 0 1",
  "8/P1k5/K7/8/8/8/8/8 w - - 0 1",
  "K1k5/8/P7/8/8/8/8/8 w - - 0 1",
  "8/k1P5/8/1K6/8/8/8/8 w - - 0 1",
  "8/8/2k5/5q2/5n2/8/5K2/8 b - - 0 1",
];

bench({
  name: "Parse FEN string",
  runs: 500,
  func(b) {
    b.start();
    for (let i = 0; i < 5; i++) {
      for (const fen of fens) {
        boardFromFEN(fen);
      }
    }
    b.stop();
  },
});

runBenchmarks();
