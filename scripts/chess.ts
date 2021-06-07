// Play a quick game of chess!

import { readLines } from "https://deno.land/std@0.97.0/io/mod.ts";
import { ChessGame, Status } from "../src/public/ChessGame.ts";

type History = {
  num: number;
  white: string;
  black: string;
};

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
  if (cmd == null) break;

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
  const board = game.toString("terminal").split("\n");
  const history: History[] = game.history()
    .reduce((acc, move) => {
      if (move.side === "white") {
        acc.push({ num: move.num, white: move.san, black: "" });
      } else {
        if (!acc.length) {
          acc.push({ num: move.num, white: "", black: move.san });
        } else {
          acc[acc.length - 1].black = move.san;
        }
      }
      return acc;
    }, [] as History[])
    .slice(-board.length);

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
  console.log("\n%s", _statusString(status));
}

function _statusString(status: Status) {
  if (status.state === "active") {
    const turn = (status.turn === "white") ? "White" : "Black";
    return `${turn} to play`;
  }
  if (status.state === "checkmate") {
    return `Checkmate! ${status.winner} wins`;
  }
  if (status.state === "resigned") {
    return `Resigned. ${status.winner} wins`;
  }
  if (status.state === "draw-stalemate") {
    const turn = (status.turn === "white") ? "White" : "Black";
    return `Draw: ${turn} is in stalemate`;
  }
  if (status.state === "draw-fifty-moves") {
    return `Draw: 50 moves since last pawn move or capture`;
  }
  if (status.state === "draw-repetition") {
    return `Draw: Threefold repetition`;
  }
  if (status.state === "draw-no-material") {
    return `Draw: Not enough material left for checkmate`;
  }
  if (status.state === "draw-other") {
    return `Draw`;
  }
}
