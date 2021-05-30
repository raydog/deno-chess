import { Board } from "../../datatypes/Board.ts";
import { Color } from "../../datatypes/Color.ts";
import { buildCoord, Coord } from "../../datatypes/Coord.ts";
import {
  // spaceEnPassant,
  spaceGetFENString,
  spaceIsEmpty,
} from "../../datatypes/Space.ts";

/**
 * Render a chess board into FEN format.
 *
 * @param board
 */
export function boardRenderFEN(board: Board): string {
  let out = "";
  
  for (let rank = 0x70; rank >= 0x00; rank -= 0x10) {
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const idx = rank | file;
      const spot = board.get(idx);

      if (spaceIsEmpty(spot)) {
        empty++;
        continue;
      }

      if (empty) {
        out += empty;
        empty = 0;
      }

      out += spaceGetFENString(spot);
    }

    if (empty) {
      out += empty;
    }

    if (rank) {
      out += "/";
    }
  }

  // Note: this doens't



  // TODO: Other game flags.
  // const turn = board.getTurnColor() === Color.White ? "w" : "b";
  // const castle = "????";
  // const enPassant = "-";
  // const halfMove = board.getHalfmoveClock();
  // const fullMove = board.getFullmoveClock();

  return out; // + ` ${turn} ${castle} ${enPassant} ${halfMove} ${fullMove}`;
}
