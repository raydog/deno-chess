import { ChessGame } from "../../src/datatypes/ChessGame.ts";
import { bench, runBenchmarks } from "../../testDeps.ts";

const MOVES = [
  "e2e4", "e7e5", "g1f3", "d8f6", "d2d4", "f8b4", "c2c3", "g8h6", "c3b4", "h6g4",
  "h2h3", "g4f2", "e1f2", "b7b6", "d1a4", "b6b5", "a4b5", "h8f8", "c1g5", "f6g5",
  "f3g5", "e5d4", "b1d2", "d4d3", "f1d3", "e8e7", "b5c5", "d7d6", "c5c7", "e7f6",
  "d2f3", "c8g4", "h3g4", "b8d7", "c7d7", "h7h6", "d7f5", "f6e7", "a1c1", "h6g5",
  "c1c7", "e7e8", "f5d7", 
];

bench({
  name: "Play full game",
  runs: 500,
  func(b) {
    b.start();
    const game = ChessGame.NewStandardGame();

    // Integrations need to fetch state, and probably a list of moves per turn:
    for (const move of MOVES) {
      game.move(move);
      const status = game.getStatus();
      const moves = game.allMoves();
    }

    b.stop();
  },
});


runBenchmarks();
