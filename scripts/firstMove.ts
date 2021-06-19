import { BeginnerAI, ChessGame } from "../mod.ts";

const game = ChessGame.NewFromFEN(
  "r3kb1r/1pp2ppp/p1n1b3/3p2q1/P3p2P/4P3/1PPP1PP1/RNB1K1NR w KQkq - 0 10",
);
const ai = BeginnerAI.NewForGame(game, "white");

ai.takeTurn();

console.log(game.toString("terminal"));
