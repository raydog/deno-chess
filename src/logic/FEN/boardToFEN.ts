import { Board } from "../../datatypes/Board.ts";
import { CastleMap, castleMapGetFile } from "../../datatypes/CastleMap.ts";
import { COLOR_BLACK, COLOR_WHITE } from "../../datatypes/Color.ts";
import { coordToAN } from "../../datatypes/Coord.ts";
import { SPACE_EMPTY, spaceGetFENString } from "../../datatypes/Space.ts";

/**
 * Render a chess board into FEN format.
 *
 * @param board
 */
export function boardToFEN(board: Board): string {
  let out = "";

  // Field 1: Board layout
  for (let rank = 0x70; rank >= 0x00; rank -= 0x10) {
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const idx = rank | file;
      const spot = board.get(idx);

      if (spot === SPACE_EMPTY) {
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

  // Field 2: Turn
  out += (board.current.turn === COLOR_WHITE) ? " w" : " b";

  // Field 3: Castle availability
  const castles = board.current.castles;
  out += " " + _castleAvailability(castles);

  // Field 4: En Passant target
  const enPassant = board.current.ep;
  out += (enPassant & 0x88) ? " -" : " " + coordToAN(enPassant);

  // Field 5: Half-move clock
  out += " " + board.current.clock;

  // Field 6: Full-move number
  out += " " + board.current.moveNum;

  return out;
}

function _castleAvailability(castles: CastleMap): string {
  let out = "";
  out += (castleMapGetFile(castles, COLOR_WHITE, true) & 0x8) ? "" : "K";
  out += (castleMapGetFile(castles, COLOR_WHITE, false) & 0x8) ? "" : "Q";
  out += (castleMapGetFile(castles, COLOR_BLACK, true) & 0x8) ? "" : "k";
  out += (castleMapGetFile(castles, COLOR_BLACK, false) & 0x8) ? "" : "q";
  return out || "-";
}
