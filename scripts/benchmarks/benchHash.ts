import { bench, runBenchmarks } from "../../testDeps.ts";
import { buildStandardBoard } from "../../src/logic/boardLayouts/standard.ts";
import { hashBoard } from "../../src/logic/hashBoard.ts";


const LOOP = 10_000;

console.log(hashBoard(buildStandardBoard()));

bench({
  name: "Object",
  runs: 1000,
  func(b) {
    const board = buildStandardBoard();

    b.start();
    
    for (let i = 0; i < LOOP; i++) {
      hashBoard(board);
    }

    b.stop();
  },
});

runBenchmarks();
