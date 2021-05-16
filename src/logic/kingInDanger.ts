import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import {
  spaceGetColor,
  spaceGetType,
  spaceIsEmpty,
} from "../datatypes/Space.ts";
import { PieceType } from "../datatypes/PieceType.ts";
import { buildCoord, Coord, parseCoord } from "../datatypes/Coord.ts";

type Step = [x: number, y: number];

// Pre-compiled lists of moves, since most moves are similar:
const BISHOP_DIRS: Step[] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ROOK_DIRS: Step[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const QUEEN_DIRS: Step[] = [...ROOK_DIRS, ...BISHOP_DIRS];
const KING_DIRS: Step[] = [...QUEEN_DIRS];
const KNIGHT_DIRS: Step[] = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [-1, 2],
  [1, -2],
  [-1, -2],
];

/**
 * Returns true if a king of the given color is currently in danger.
 *
 * TODO: This method is fairly inefficient. Perhaps optimize, eventually?
 *
 * @param b
 * @param kingColor
 * @returns
 */
export function kingInDanger(b: Board, kingColor: Color): boolean {
  const isTargetKing = (idx: Coord): boolean => {
    const sp = b.get(idx);
    return !spaceIsEmpty(sp) && spaceGetType(sp) === PieceType.King &&
      spaceGetColor(sp) === kingColor;
  };

  for (let idx = 0; idx < 64; idx++) {
    const sp = b.get(idx);
    if (spaceIsEmpty(sp)) continue;
    if (spaceGetColor(sp) === kingColor) continue;

    // Ok, this space contains an opponent piece. Check to see if they are capable of delivering check:
    const [file, rank] = parseCoord(idx);
    const type = spaceGetType(sp);
    switch (type) {
      case PieceType.Pawn: {
        const dir = kingColor === Color.White ? -1 : 1;
        const newrank = rank + dir;
        if (newrank < 0 || newrank >= 8) break;
        if (file > 0 && isTargetKing(buildCoord(file - 1, newrank))) {
          return true;
        }
        if (
          file < 7 && isTargetKing(buildCoord(file + 1, rank + dir))
        ) {
          return true;
        }
        break;
      }

      // Slidey pieces:

      case PieceType.Bishop:
      case PieceType.Rook:
      case PieceType.Queen: {
        const dirs = type === PieceType.Bishop
          ? BISHOP_DIRS
          : (type === PieceType.Rook)
          ? ROOK_DIRS
          : QUEEN_DIRS;
        for (const [dx, dy] of dirs) {
          for (let dist = 1; dist < 8; dist++) {
            const x = file + dx * dist, y = rank + dy * dist;
            if (x < 0 || x >= 8 || y < 0 || y >= 8) break;

            const idx = buildCoord(x, y);
            const sp = b.get(idx);

            // Don't care if empty:
            if (spaceIsEmpty(sp)) continue;

            // Else there's a piece here. Is it the king?
            if (isTargetKing(idx)) return true;

            // No, but there's still a piece here, so quit with this direction:
            break;
          }
        }
        break;
      }

      // Steppy pieces:

      case PieceType.Knight:
      case PieceType.King: {
        const dirs = type === PieceType.Knight ? KNIGHT_DIRS : KING_DIRS;
        for (const [dx, dy] of dirs) {
          const x = file + dx, y = rank + dy;
          if (x < 0 || x >= 8 || y < 0 || y >= 8) continue;
          if (isTargetKing(buildCoord(x, y))) return true;
        }
        break;
      }
    }
  }

  return false;
}
