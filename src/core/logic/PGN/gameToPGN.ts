import { Board } from "../../datatypes/Board.ts";
import { ChessBadInput } from "../../datatypes/ChessError.ts";

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
const TAG_KEY_RE = /^[A-Z][a-zA-Z0-9_]*$/;
const TAG_VAL_RE = /^[\u0020-\u007e]*$/;

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
  out += "\n";

  let lineLen = 0;
  for (let idx = 0; idx < moves.length; idx++) {
    const move = moves[idx];

    let wip = "";
    if (!idx || move.side === "white") {
      wip += move.num;
      wip += (move.side === "white") ? ". " : "... ";
    }
    wip += move.san;

    lineLen += wip.length;
    if (lineLen > MAX_LINE) {
      out += "\n";
      lineLen = wip.length;
    }

    out += wip;
    if (lineLen < MAX_LINE) {
      out += " ";
      lineLen++;
    }
  }
  out += pgnWinner;
  return out;
}

function _tag(key: string, val: string) {
  if (!TAG_KEY_RE.test(key)) {
    throw new ChessBadInput("Invalid PGN tag name: " + key);
  }
  if (!TAG_VAL_RE.test(val)) {
    throw new ChessBadInput("Invalid characters in PGN tag value");
  }

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
