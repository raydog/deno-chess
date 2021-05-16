import { Board } from "../../datatypes/Board.ts";
import { Color } from "../../datatypes/Color.ts";
import { buildCoord } from "../../datatypes/Coord.ts";
import { spaceGetFENString, spaceIsEmpty } from "../../datatypes/Space.ts";

/**
 * Render a chess board into FEN format.
 *
 * @param board
 */
export function forsythEdwardsNotation(board: Board): string {
  let out = "";
  for (let rank = 7; rank >= 0; rank--) {
    let row = "";
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const spot = board.get(buildCoord(file, rank));

      if (spaceIsEmpty(spot)) {
        empty++;
        continue;
      }

      if (empty) {
        row += empty;
        empty = 0;
      }

      row += spaceGetFENString(spot);
    }

    if (empty) {
      row += empty;
    }

    if (rank > 0) {
      row += "/";
    }

    out += row;
  }

  // TODO: Other game flags.
  // const turn = board.getTurnColor() === Color.White ? "w" : "b";
  // const castle = "????";
  // const enPassant = "-";
  // const halfMove = board.getHalfmoveClock();
  // const fullMove = board.getFullmoveClock();

  return out; // + ` ${turn} ${castle} ${enPassant} ${halfMove} ${fullMove}`;
}
