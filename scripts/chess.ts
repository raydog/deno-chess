// Play a quick game of chess!

import { readLines } from "https://deno.land/std@0.97.0/io/mod.ts";
import { ChessGame, Status } from "../src/datatypes/ChessGame.ts";

// Quick class to handle user I/O:
class ChessRepl {
  #te = new TextEncoder();
  #lines = readLines(Deno.stdin);

  async prompt(msg = "> "): Promise<string> {
    const bytes = this.#te.encode(msg);
    await Deno.stdout.write(bytes);
    return await (await this.#lines.next()).value;
  }
}

// User-visible strings for the status codes:
const STATUS_STRINGS: { [status in Status]: string } = {
  white: "White to play",
  black: "Black to play",
  "checkmate-white": "CHECKMATE! White wins",
  "checkmate-black": "CHECKMATE! Black wins",
  "draw-stalemate": "Draw: Stalemate",
  "draw-repetition": "Draw: Threefold repetition",
  "draw-fifty-moves": "Draw: 50 move rule",
  "draw-no-material": "Draw: Dead position",
  "draw-other": "Draw",
};

const game = ChessGame.NewStandardGame();
const repl = new ChessRepl();

// Main Game loop
let needPrint = true;
mainLoop:
while (true) {
  if (needPrint) {
    printGame(game);
    needPrint = false;
  }

  if (game.isGameOver()) {
    break mainLoop;
  }

  const cmd = await repl.prompt();
  if (cmd == null) { break; }

  const normal = cmd.trim().toLowerCase();
  switch (normal) {
    case "":
      break;

    case "q":
    case "quit":
    case "exit":
    case "resign":
      break mainLoop;

    case "?":
      console.log("Moves:", game.allMoves().join(", "));
      break;

    default: {
      // Else, assume this is a move.
      try {
        game.move(cmd);
        needPrint = true;
      } catch (ex) {
        console.log("ERROR:", ex.message);
      }
    }
  }
}

// Print out a current game's state:
function printGame(game: ChessGame) {
  const board = game.toString().split("\n");
  const history = game.history().slice(-board.length);

  for (let line = 0; line < board.length; line++) {
    let turnStr = "";
    const turn = history[line];
    if (turn) {
      const numStr = turn.num + ".";
      turnStr = `${numStr.padEnd(4)} ${turn.white.padEnd(7)} ${turn.black ||
        "..."}`;
    }
    console.log(board[line], " ", turnStr);
  }

  const status = game.getStatus();
  console.log("\n%s", STATUS_STRINGS[status]);
}
