import { BeginnerAI } from "../../src/autoplayers/BeginnerAI.ts";
import { ChessGame } from "../../src/datatypes/ChessGame.ts";

// Chess openings to use as starting points. FENs from that CSV repository, so they lack counters:
const OPENINGS: [name: string, fen: string][] = [
  [
    "Ruy Lopez",
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -",
  ],
  [
    "Ruy Lopez: Alapin Defense",
    "r1bqk1nr/pppp1ppp/2n5/1B2p3/1b2P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Ruy Lopez: Bulgarian Variation",
    "r1bqkbnr/1ppp1ppp/2n5/pB2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Ruy Lopez: Fianchetto Defense",
    "r1bqkbnr/pppp1p1p/2n3p1/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Ruy Lopez: Nürnberg Variation",
    "r1bqkbnr/pppp2pp/2n2p2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Ruy Lopez: Pollock Defense",
    "r1bqkbnr/pppp1ppp/8/nB2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Ruy Lopez: Rotary-Albany Gambit",
    "r1bqkbnr/p1pp1ppp/1pn5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Ruy Lopez: Bird Variation",
    "r1bqkbnr/pppp1ppp/8/1B2p3/3nP3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Ruy Lopez: Classical Variation",
    "r1bqk1nr/pppp1ppp/2n5/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Ruy Lopez: Berlin Defense",
    "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],

  // Italian Game
  [
    "Italian Game",
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -",
  ],
  [
    "Italian Game: Anti-Fried Liver Defense",
    "r1bqkbnr/pppp1pp1/2n4p/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Italian Game: Giuoco Pianissimo",
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq -",
  ],
  [
    "Italian Game: Evans Gambit",
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq -",
  ],
  [
    "Italian Game: Classical Variation",
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq -",
  ],
  [
    "Italian Game: Giuoco Piano",
    "r1bqk2r/ppp2ppp/3p1n2/4p1B1/2BnP3/8/PPP2PPP/RN1Q1RK1 w kq -",
  ],
  [
    "Italian Game: Scotch Gambit",
    "r1bqkb1r/pppp1ppp/2n2n2/8/2BpP3/5N2/PPP2PPP/RNBQ1RK1 b kq -",
  ],
  [
    "Italian Game: Two Knights Defense",
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -",
  ],
  [
    "Italian Game: Two Knights Defense",
    "r1bqkb1r/p4ppp/2p2n2/n3p1N1/8/8/PPPPBPPP/RNBQK2R b KQkq -",
  ],
  [
    "Italian Game: Scotch Gambit, Double Gambit Accepted",
    "r1bqkb1r/pppp1ppp/2n5/8/2Bpn3/5N2/PPP2PPP/RNBQ1RK1 w kq -",
  ],

  // Sicilian Defense
  [
    "Sicilian Defense",
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -",
  ],
  [
    "Sicilian Defense: Gloria Variation",
    "r1bqkbnr/pp2ppp1/2np4/2p4p/2P1P3/2N3P1/PP1P1P1P/R1BQKBNR w KQkq -",
  ],
  [
    "Sicilian Defense: Halasz Gambit",
    "rnbqkbnr/pp1ppppp/8/8/3pPP2/8/PPP3PP/RNBQKBNR b KQkq -",
  ],
  [
    "Sicilian Defense: Morphy Gambit",
    "rnbqkbnr/pp1ppppp/8/8/3pP3/5N2/PPP2PPP/RNBQKB1R b KQkq -",
  ],
  [
    "Sicilian Defense: Smith-Morra Gambit",
    "rnbqkbnr/pp1ppppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq -",
  ],
  [
    "Sicilian Defense: Alapin Variation",
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR b KQkq -",
  ],
  [
    "Sicilian Defense: Closed",
    "rnbqkbnr/pp1p1ppp/4p3/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR b KQkq -",
  ],
  [
    "Sicilian Defense: Hyperaccelerated Dragon",
    "rnbqkbnr/pp1ppp1p/6p1/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -",
  ],
  [
    "Sicilian Defense: Nimzowitsch Variation",
    "rnbqkb1r/pp1ppppp/5n2/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -",
  ],
  [
    "Sicilian Defense: Löwenthal Variation",
    "r1bqkbnr/pp1p1ppp/2n5/4p3/3NP3/8/PPP2PPP/RNBQKB1R w KQkq -",
  ],
  // French Defense

  // King's Indian

  // Queen's Indian

  // English Opening
];

function competeAIs(fen: string): [number, number] {
  const start = Date.now();

  const game = ChessGame.NewFromFEN(fen);
  const white = BeginnerAI.NewForGame(game, "white");
  const black = BeginnerAI.NewForGame(game, "black");
  while (!game.isGameOver()) {
    const { turn } = game.getStatus();
    if (turn === "white") {
      white.takeTurn();
    } else {
      black.takeTurn();
    }
  }

  const status = game.getStatus();
  if (status.state.startsWith("draw")) {
    console.log("- Draw in %d ms", Date.now() - start);
    return [0.5, 0.5];
  }

  console.log(
    "- Checkmate (%s win) in %d ms",
    (status.turn === "white" ? "black" : "white"),
    Date.now() - start,
  );

  return (status.turn === "white") ? [0, 1] : [1, 0];
}

let wTotal = 0, bTotal = 0;
for (const [name, fen] of OPENINGS) {
  console.log(name);
  const [w, b] = competeAIs(fen + " 0 0");
  wTotal += w;
  bTotal += b;
}

console.log("White", wTotal);
console.log("Black", bTotal);
