import { Color } from "../../datatypes/Color.ts";
import { coordToAN } from "../../datatypes/Coord.ts";
import { Move, moveGetCapture, moveGetCastle, moveGetColor, moveGetDest, moveGetEnemyHasMoves, moveGetEnemyInCheck, moveGetPromotion, moveGetType } from "../../datatypes/Move.ts";
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
  let mainStr;

  const castle = moveGetCastle(move);
  if (castle) {
    mainStr = (castle === 2)
      ? "O-O-O" // Queenside
      : "O-O"; // Kingside;
  } else {
    const depart = ""; // TODO
    const who = _anPieceType(moveGetType(move));
    const capture = moveGetCapture(move) ? "x" : "";
    const dest = coordToAN(moveGetDest(move));
    const promote = moveGetPromotion(move);
    const promoteStr = promote ? "=" + _anPieceType(promote) : "";
    mainStr = `${depart}${who}${capture}${dest}${promoteStr}`;
  }

  const gamestate = _checksAndMates(move);
  return `${mainStr}${gamestate}`;
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
  const enemyInCheck = moveGetEnemyInCheck(move)
  const enemyCanMove = moveGetEnemyHasMoves(move);
  if (enemyCanMove === false) {
    // End of game has happened. Either checkmate or stalemate:
    return enemyInCheck
      ? "# " + (moveGetColor(move) === Color.White ? "1-0" : "0-1")
      : " ½-½";
  }
  return enemyInCheck ? "+" : "";
}
