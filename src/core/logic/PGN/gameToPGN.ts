import { Board } from "../../datatypes/Board.ts";
import { validatePGNKeyValue } from "./pgnUtils.ts";

type GameData = {
  board: Board;
  winner: "white" | "black" | "draw" | null;
  moves: Array<{
    num: number;
    side: "white" | "black";
    san: string;
  }>;
  tags: { [key: string]: string };
};

const MAX_LINE = 80;

/**
 * Write the given game state to a PGN string.
 *
 * Spec: https://ia802908.us.archive.org/26/items/pgn-standard-1994-03-12/PGN_standard_1994-03-12.txt
 */
export function gameToPGN({ winner, moves, tags }: GameData): string {
  const pgnWinner = _pgnWinner(winner);
  tags = {
    // Specs state that we need these tags, at minimum:
    Event: "?",
    Site: "?",
    Date: "????.??.??",
    Round: "?",
    White: "?",
    Black: "?",
    Result: pgnWinner,
    // TODO: FEN start, when appropriate.
    ...tags,
  };
  let out = "";
  for (const key of Object.keys(tags)) {
    out += _tag(key, tags[key]) + "\n";
  }

  let lineLen = 1000;
  function pushStr(str: string) {
    if (lineLen + str.length + 1 > MAX_LINE) {
      lineLen = str.length;
      out += "\n" + str;
    } else {
      lineLen += str.length + 1;
      out += " " + str;
    }
  }

  for (let idx = 0; idx < moves.length; idx++) {
    const move = moves[idx];
    if (!idx || move.side === "white") {
      pushStr(`${move.num}${(move.side === "white") ? "." : "..."}`);
    }
    pushStr(move.san);
  }
  pushStr(pgnWinner);
  return out;
}

function _tag(key: string, val: string) {
  validatePGNKeyValue(key, val);
  val = val.replace(/["\\]/g, "\\$&");
  return `[${key} "${val}"]`;
}

function _pgnWinner(winner: "white" | "black" | "draw" | null): string {
  switch (winner) {
    case "white":
      return "1-0";
    case "black":
      return "0-1";
    case "draw":
      return "1/2-1/2";
    default:
      return "*";
  }
}
