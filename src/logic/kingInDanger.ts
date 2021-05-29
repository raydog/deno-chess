import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import {
  spaceGetColor,
  spaceGetType,
  spaceIsEmpty,
} from "../datatypes/Space.ts";
import { PieceType } from "../datatypes/PieceType.ts";
import { nextCoord } from "../datatypes/Coord.ts";

type MoveInfo = [step: number, mask: number];

const _mask = (...pieces: PieceType[]) => {
  return pieces.reduce(
    (acc, piece: PieceType) => acc | (1 << piece),
    0,
  );
};

// List of the offsets for slide moves. The mask is a bitmap of which pieces we're afraid of in this direction.
// NOTE: if the piece enums change, we'll need to update the masks as well.
const SLIDES: MoveInfo[] = [
  [16, _mask(PieceType.Rook, PieceType.Queen)],
  [-16, _mask(PieceType.Rook, PieceType.Queen)],
  [1, _mask(PieceType.Rook, PieceType.Queen)],
  [-1, _mask(PieceType.Rook, PieceType.Queen)],
  [15, _mask(PieceType.Bishop, PieceType.Queen)],
  [17, _mask(PieceType.Bishop, PieceType.Queen)],
  [-17, _mask(PieceType.Bishop, PieceType.Queen)],
  [-15, _mask(PieceType.Bishop, PieceType.Queen)],
];

// List of the offsets for steppy moves. With a similar "do I care?" bitmask:
const STEPS: MoveInfo[] = [
  [31, _mask(PieceType.Knight)],
  [33, _mask(PieceType.Knight)],
  [14, _mask(PieceType.Knight)],
  [18, _mask(PieceType.Knight)],
  [-18, _mask(PieceType.Knight)],
  [-14, _mask(PieceType.Knight)],
  [-33, _mask(PieceType.Knight)],
  [-31, _mask(PieceType.Knight)],

  [15, _mask(PieceType.King)],
  [16, _mask(PieceType.King)],
  [17, _mask(PieceType.King)],
  [-1, _mask(PieceType.King)],
  [1, _mask(PieceType.King)],
  [-17, _mask(PieceType.King)],
  [-16, _mask(PieceType.King)],
  [-15, _mask(PieceType.King)],
];

// Similar for pawns, but the index in this array is equal to the enum value for the KING'S color:
const PAWNS: MoveInfo[][] = [
  [
    [15, _mask(PieceType.Pawn)],
    [17, _mask(PieceType.Pawn)],
  ],
  [
    [-17, _mask(PieceType.Pawn)],
    [-15, _mask(PieceType.Pawn)],
  ],
];

/**
 * Returns true if a king of the given color is currently in danger.
 *
 * TODO: This method is alright, performance-wise, but we might consider incrementally-updated attack maps at some
 * point...
 *
 * @param b
 * @param kingColor
 * @returns
 */
export function kingInDanger(b: Board, kingColor: Color): boolean {
  for (let idx = 0; (idx & 0x88) === 0; idx = nextCoord(idx)) {
    const spot = b.get(idx);

    if (
      spaceIsEmpty(spot) || spaceGetType(spot) !== PieceType.King ||
      spaceGetColor(spot) !== kingColor
    ) {
      continue;
    }

    // Else, this is a King that we care about. Scan out, looking for possible attackers.

    // Slidy pieces first:
    for (const [offset, offMask] of SLIDES) {
      for (
        let newIdx = idx + offset;
        (newIdx & 0x88) === 0;
        newIdx += offset
      ) {
        const newSpot = b.get(newIdx);
        if (spaceIsEmpty(newSpot)) continue;
        if (spaceGetColor(newSpot) === kingColor) break;
        if (offMask & (1 << spaceGetType(newSpot))) {
          // This is an enemy piece that we care about:
          return true;
        }
        // Else, some other enemy piece. Next direction...
        break;
      }
    }

    // Now steppy pieces:
    for (const [offset, offMask] of STEPS) {
      const newIdx = idx + offset;
      if (newIdx & 0x88) continue;

      const newSpot = b.get(newIdx);
      if (
        !spaceIsEmpty(newSpot) && spaceGetColor(newSpot) !== kingColor &&
        (offMask & (1 << spaceGetType(newSpot)))
      ) {
        // This is a steppy piece, in a spot that we care about:
        return true;
      }
    }

    // And now pawns:
    for (const [offset, offMask] of PAWNS[kingColor]) {
      const newIdx = idx + offset;
      if (newIdx & 0x88) continue;

      const newSpot = b.get(newIdx);
      if (
        !spaceIsEmpty(newSpot) && spaceGetColor(newSpot) !== kingColor &&
        (offMask & (1 << spaceGetType(newSpot)))
      ) {
        // This is a pawn in a spot that we care about:
        return true;
      }
    }
  }
  return false;
}
