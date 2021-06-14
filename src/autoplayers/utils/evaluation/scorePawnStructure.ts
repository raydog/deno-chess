import { Board } from "../../../core/datatypes/Board.ts";
import { Color, COLOR_WHITE } from "../../../core/datatypes/Color.ts";
import { Coord } from "../../../core/datatypes/Coord.ts";
import { PieceType, PIECETYPE_PAWN } from "../../../core/datatypes/PieceType.ts";
import {
  SPACE_EMPTY,
  spaceGetColor,
  spaceGetType,
Space,
} from "../../../core/datatypes/Space.ts";
import { ScoreSettings } from "./scoreSettings.ts";

// // How well structured are our pawns?
// PawnStructure: {
//   /**
//    * A score (probably negative) for a pawn not having another pawn in a nearby file.
//    *
//    * (To discourage these isolated pawn islands.)
//    */
//   IsolatedPawn: number;

//   /**
//    * A score (probably negative) for a pawn being blocked by another pawn of the same color.
//    *
//    * (To discourage pawns being stacked that way, since they're tricky to move and defend.)
//    */
//   DoubledPawn: number;

//   /**
//    * A score for a pawn not having any enemy pawns in front of them.
//    *
//    * (To encourage past pawns, for possible promotion in endgame.)
//    */
//   PastPawn: number;

//   /**
//    * A score for when a pawn has another pawn defending it.
//    *
//    * (To encourage pawns to line up in defended patterns.)
//    */
//   PawnSupport: number;

//   /**
//    * A score for each rank BEHIND a pawn.
//    *
//    * (To encourage pawns to move up.)
//    */
//   PawnRanks: number;
// };

/**
 * Returns the pure-material score for the given board state.
 *
 * @param board
 * @param settings
 * @returns
 */
export function scorePawnStructures(
  board: Board,
  { PawnStructure: { IsolatedPawn, DoubledPawn, PastPawn, PawnSupport, PawnRanks } }: ScoreSettings,
): number {
  
  let numDoubledPawns = 0;
  let numPawnSupport = 0;
  let numPawnRanks = 0;

  for (let file = 0; file < 0x8; file++) {
    let prevPawnColor: Color | -1 = -1;
    
    for (let rank = 0; rank < 0x80; rank += 0x10) {
      const idx = rank | file;
      const spot = board.get(idx);

      if (spot === SPACE_EMPTY) continue;

      const type = spaceGetType(spot);
      const color = spaceGetColor(spot);
      const dir = (color === COLOR_WHITE) ? 1 : -1;

      if (type !== PIECETYPE_PAWN) {
        prevPawnColor = -1;
        continue;
      }

      // Doubled Pawns:
      if (color === prevPawnColor) {
        numDoubledPawns += dir;
      }
      prevPawnColor = color;

      // Pawn Support:
      const leftIdx = idx - (dir << 4) - 1;
      const rightIdx = idx - (dir << 4) + 1;
      if (hasSimilarPawn(board, leftIdx, color) || hasSimilarPawn(board, rightIdx, color)) {
        numPawnSupport += dir;
      }

      // Pawn Ranks:
      if (color === COLOR_WHITE) {
        numPawnRanks += (rank >>> 4) - 1;
      } else {
        numPawnRanks -= 6 - (rank >>> 4);
      }
    }
  }

  return (
    numDoubledPawns * DoubledPawn + 
    numPawnSupport * PawnSupport + 
    numPawnRanks * PawnRanks
  );
}

function hasSimilarPawn(board: Board, idx: Coord, color: Color): boolean {
  if (idx & 0x88) { return false; }
  const spot = board.get(idx);
  return (
    spot !== SPACE_EMPTY &&
    spaceGetType(spot) === PIECETYPE_PAWN &&
    spaceGetColor(spot) === color
  );
}
