import { BeginnerAI } from "../../src/autoplayers/BeginnerAI.ts";
import { ChessGame } from "../../src/core/datatypes/ChessGame.ts";
import { bench, runBenchmarks } from "../../testDeps.ts";

bench({
  name: "Easy AI: McConnell Defense",
  runs: 50,
  func(b) {
    const game = ChessGame.NewFromFEN(
      "rnb1kbnr/pppp1ppp/5q2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    );
    const ai = BeginnerAI.NewForGame(game, "black");

    b.start();
    ai.takeTurn();
    b.stop();
  },
});

runBenchmarks();
