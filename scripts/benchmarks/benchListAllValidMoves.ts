import { ChessGame } from "../../src/datatypes/ChessGame.ts";
import { bench, runBenchmarks } from "../../testDeps.ts";

bench({
  name: "Giuoco Piano Opening",
  runs: 1000,
  func(b) {
    const giuocoPiano = ChessGame.NewStandardGame()
      .move("e2-e4").move("e7-e5")
      .move("g1-f3").move("b8-c6")
      .move("f1-c4").move("f8-c5");

    // console.log(giuocoPiano.history())
    // console.log(giuocoPiano.toString());

    b.start();
    // This operation is pretty quick, so do it a bunch of times to get more signal:
    for (let i = 0; i < 100; i++) {
      const _moves = giuocoPiano.allMoves();
    }
    b.stop();
  },
});

runBenchmarks();
