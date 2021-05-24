import { ChessGame } from "../../src/datatypes/ChessGame.ts";
import { Color } from "../../src/datatypes/Color.ts";
import { listAllValidMoves } from "../../src/logic/listValidMoves.ts";
// import { moveToAN } from "../../src/logic/moveFormats/algebraicNotation.ts";
import { runBenchmarks, bench } from "../../testDeps.ts";


// TODO: Get rid of the _getBoard hack...

const giuocoPianoBoard = (ChessGame.NewStandardGame()
  .move("e2-e4").move("e7-e5")
  .move("g1-f3").move("b8-c6")
  // deno-lint-ignore no-explicit-any
  .move("f1-c4").move("f8-c5") as any)
  ._getBoard();


bench({
  name: "Giuoco Piano Opening",
  runs: 500,
  func(b) {
    b.start();
    const moves = listAllValidMoves(giuocoPianoBoard, Color.White, true);
    b.stop();
  }
})

runBenchmarks();
