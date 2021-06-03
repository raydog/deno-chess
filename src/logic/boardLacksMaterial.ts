import { Board } from "../datatypes/Board.ts";
import { spaceGetType, spaceIsEmpty } from "../datatypes/Space.ts";
import { PieceType, PIECETYPE_BISHOP, PIECETYPE_KNIGHT, PIECETYPE_PAWN, PIECETYPE_QUEEN, PIECETYPE_ROOK } from "../datatypes/PieceType.ts";

/**
 * Returns true if there just isn't enough material on the board for there to be a checkmate. We can't catch all of
 * these cases, but we try to catch as many as we can from the US Chess Rule Book, section 14D: Insufficient material to
 * continue. This includes:
 *
 * - Just 2 Kings. (14D1)
 * - King vs King + (Bishop OR Knight) (14D2)
 * - Kings + Bishops, all Bishops on same color (Extension of 14D3)
 *
 * - Section 14D4 is less defined. We may just need a "draw" API as an escape-hatch for that.
 *
 * @link http://www.uschess.org/docs/gov/chessrules/US_Chess_Rule_Book-%20Online_Only_Edition_v7.1-1.2.11-7.19.19.pdf
 *
 * @param b
 * @returns
 */
export function boardLacksMaterial(b: Board): boolean {
  let count = 0;
  const counts = Array(8).fill(0);
  let bishopDiag = 0;

  for (let rank = 0; rank < 0x80; rank += 0x10) {
    for (let file = 0; file < 0x8; file++) {
      const idx = rank | file;

      const spot = b.get(idx);
      if (spaceIsEmpty(spot)) continue;

      const type = spaceGetType(spot);

      // Queens and rooks are strong enough that we can bail early if we encounter them. Pawns too, since none of the
      // FIDE reasons for draw include pawns.
      if (
        type === PIECETYPE_PAWN || type === PIECETYPE_ROOK ||
        type === PIECETYPE_QUEEN
      ) {
        return false;
      }

      count++;

      // If a Bishop, we want to keep track of what tile color they're on:
      if (type === PIECETYPE_BISHOP) {
        const diag = ((idx >>> 4) ^ idx) & 1;
        // Hack: We add all squares into the bishopDiag accumulator. We only care if all bishops are on the same color,
        // so that variable will either be 0 or equal to the number of bishops.
        bishopDiag += diag;
      }

      // Else, count it:
      counts[type]++;
    }
  }

  // Only 2 kings:
  if (count === 2) {
    return true;
  }

  // King vs King with a bishop or a knight:
  const nBishops = counts[PIECETYPE_BISHOP];
  const nKnights = counts[PIECETYPE_KNIGHT];
  if (count === 3 && (nBishops === 1 || nKnights === 1)) {
    return true;
  }

  // Only kings and bishops: (Bishops on same color)
  if (count === nBishops + 2 && (bishopDiag === 0 || bishopDiag === nBishops)) {
    return true;
  }
  return false;
}
