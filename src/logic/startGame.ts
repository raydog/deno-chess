import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import { Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King } from "../datatypes/Pieces.ts";

export function startGame(): Board {
  const b = new Board();

  _putBackRow(b, 7, Color.Black);
  _putPawnRow(b, 6, Color.Black);
  _putPawnRow(b, 1, Color.White);
  _putBackRow(b, 0, Color.White);

  return b;
}

function _putBackRow(board: Board, rank: number, color: Color) {
  board.set([ 0, rank ], new Rook(color));
  board.set([ 1, rank ], new Knight(color));
  board.set([ 2, rank ], new Bishop(color));
  board.set([ 3, rank ], new Queen(color));
  board.set([ 4, rank ], new King(color));
  board.set([ 5, rank ], new Bishop(color));
  board.set([ 6, rank ], new Knight(color));
  board.set([ 7, rank ], new Rook(color));
}

function _putPawnRow(board: Board, rank: number, color: Color) {
  for (let file=0; file<8; file++) {
    board.set([file, rank], new Pawn(color));
  }
}
