
const { Chess } = require("chess.js");

// deno-fmt-ignore
const MOVES = [
  "e2e4", "e7e5", "g1f3", "d8f6", "d2d4", "f8b4", "c2c3", "g8h6", "c3b4", "h6g4",
  "h2h3", "g4f2", "e1f2", "b7b6", "d1a4", "b6b5", "a4b5", "h8f8", "c1g5", "f6g5",
  "f3g5", "e5d4", "b1d2", "d4d3", "f1d3", "e8e7", "b5c5", "d7d6", "c5c7", "e7f6",
  "d2f3", "c8g4", "h3g4", "b8d7", "c7d7", "h7h6", "d7f5", "f6e7", "a1c1", "h6g5",
  "c1c7", "e7e8", "f5d7", 
];

function doTest() {

  const start = process.hrtime.bigint();

  const chess = new Chess();
  
  // Integrations need to fetch state, and probably a list of moves per turn:
  for (const move of MOVES) {
    chess.move({ from: move.slice(0, 2), to: move.slice(2) });

    // No direct analogue, lets say that is_game_over is "close enough" even if it returns less data:
    const status = chess.game_over();
    const moves = chess.moves();
  }

  return Number(process.hrtime.bigint() - start) / 1_000_000;
}

let sum = 0;
for (let i=0; i<500; i++) {
  sum += doTest();
}

console.log("Mean time to play a full game: %d ms", sum / 500);
