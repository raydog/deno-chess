import { Color } from "../../datatypes/Color.ts";
import { coordToAN } from "../../datatypes/Coord.ts";
import { Move } from "../../datatypes/Move.ts";
import { PieceType } from "../../datatypes/PieceType.ts";
import { spaceGetColor, spaceGetType } from "../../datatypes/Space.ts";

/**
 * Will render a given move in Algebraic Notation, or Standard Notation, or Coordinate Notation. Whatever you call it,
 * it looks like "bQxf7+".
 *
 * @param move
 * @returns
 */
export function moveToAN(move: Move): string {
  // Special case: Castles get their own notation. Note: FIDE uses zeros here, but we use upper-case O's to be
  // compatible with PGN
  if (move.castleRook) {
    // Note: This works for now, but is probably not compatible with chess960...
    return (move.castleRookFrom < move.castleRookDest)
      ? "O-O-O" // Queenside
      : "O-O"; // Kingside;
  }

  const depart = ""; // TODO
  const who = _anPieceType(spaceGetType(move.what));
  const capture = move.capture ? "x" : "";
  const dest = coordToAN(move.dest);
  const promote = move.promote ? "=" + _anPieceType(move.promote) : "";
  const gamestate = _checksAndMates(move);

  return `${depart}${who}${capture}${dest}${promote}${gamestate}`;
}

// Annotate the piece type:
function _anPieceType(t: PieceType): string {
  switch (t) {
    case PieceType.Bishop:
      return "B";
    case PieceType.Knight:
      return "N";
    case PieceType.Rook:
      return "R";
    case PieceType.Queen:
      return "Q";
    case PieceType.King:
      return "K";
    default: // << Pawns don't get a char. :'-(
      return "";
  }
}

// Annotate check (+), checkmate (#), and end-of-game in general:
function _checksAndMates(move: Move): string {
  if (move.enemyHasMove === false) {
    // End of game has happened. Either checkmate or stalemate:
    return move.check
      ? "# " + (spaceGetColor(move.what) === Color.White ? "1-0" : "0-1")
      : " 0-0";
  }
  return move.check ? "+" : "";
}
