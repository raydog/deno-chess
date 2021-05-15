import { Board } from "../../datatypes/Board.ts";
import { Color } from "../../datatypes/Color.ts";
import { Coord } from "../../datatypes/Coord.ts";
import { PieceType } from "../../datatypes/PieceType.ts";
import { encodePieceSpace } from "../../datatypes/Space.ts";


const BACK_ROW = [ PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Queen, PieceType.King, PieceType.Bishop, PieceType.Knight, PieceType.Rook ];
const PAWN_ROW = Array(8).fill(PieceType.Pawn);

/**
 * Create a new Chess board, in the standard starting position.
 * 
 * @returns A new board.
 */
export function buildStandardBoard(): Board {
  const out = new Board();

  _setRow(out, Color.White, 0, BACK_ROW);
  _setRow(out, Color.White, 8, PAWN_ROW);

  _setRow(out, Color.Black, 48, PAWN_ROW);
  _setRow(out, Color.Black, 56, BACK_ROW);

  return out;
}

function _setRow(b: Board, color: Color, start: Coord, pieces: PieceType[]) {
  for (let i=0; i<8; i++) {
    b.set(start + i, encodePieceSpace(pieces[i], color, false, false));
  }
}
