import { Board } from "../core/datatypes/Board.ts";
import { ChessGame } from "../public/ChessGame.ts";
import { Color, COLOR_BLACK, COLOR_WHITE } from "../core/datatypes/Color.ts";
import { coordToAN } from "../core/datatypes/Coord.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
  pieceTypeLetter,
} from "../core/datatypes/PieceType.ts";
import { boardFromFEN } from "../core/logic/FEN/boardFromFEN.ts";
import { scoreToString } from "./utils/gameScore.ts";
import { searchBestMoves } from "./utils/miniMax.ts";
import { boardScore } from "./utils/evaluation/boardScore.ts";
import { ScoreSettings } from "./utils/evaluation/ScoreSettings.ts";
import { hashBoard } from "../core/logic/hashBoard.ts";
import { compileOpeningBook } from "./utils/openingBook.ts";
import { listOrderedMoves } from "./utils/evaluation/listOrderedMoves.ts";

type TurnColor = "white" | "black";

function _parseTurnColor(color: TurnColor): Color {
  return (color === "white") ? COLOR_WHITE : COLOR_BLACK;
}

export class BeginnerAI {
  // Game is what we use to interface with the user's game.
  #game: ChessGame;

  // These are scratch spaces for our work:
  #color: Color;
  #board: Board = new Board();

  static #book = compileOpeningBook();
  static #settings: ScoreSettings = {
    Material: {
      [PIECETYPE_PAWN]: 100,
      [PIECETYPE_BISHOP]: 300,
      [PIECETYPE_KNIGHT]: 300,
      [PIECETYPE_ROOK]: 500,
      [PIECETYPE_QUEEN]: 900,
      [PIECETYPE_KING]: 20000,
    },

    Mobility: {
      MoveScore: 25,
    },

    PawnStructure: {
      IsolatedPawn: -50,
      DoubledPawn: -20,
      PastPawn: 80,
      PawnSupport: 20,
      PawnAdvancement: 20,
    },

    Random: {
      Range: 0,
      BookOdds: 1,
    },
  };

  constructor(game: ChessGame, color: Color) {
    this.#game = game;
    this.#color = color;
  }

  static NewForGame(game: ChessGame, color: TurnColor): BeginnerAI {
    return new BeginnerAI(game, _parseTurnColor(color));
  }

  takeTurn() {
    const board = this.#board;
    const status = this.#game.getStatus();
    if (status.state !== "active") {
      console.warn("Game over");
      return;
    }

    const turn = _parseTurnColor(status.turn);
    if (turn !== this.#color) {
      console.warn("Not my turn...");
      return;
    }

    const fen = this.#game.toString("fen");
    boardFromFEN(fen, board);

    // If this board exists in our opening book, maybe use it?
    const book = BeginnerAI.#book[hashBoard(board)];

    if (book?.length && Math.random() < BeginnerAI.#settings.Random.BookOdds) {
      const bookMove = book[Math.floor(Math.random() * book.length)];
      console.log(
        "Book Move (%s) = [%s]",
        scoreToString(0),
        bookMove,
      );

      this.#game.move(bookMove);
      return;
    }

    // Else, we gotta do this the hard way:
    const start = Date.now();

    const best = searchBestMoves(
      board,
      turn,
      3,
      (board) => listOrderedMoves(BeginnerAI.#settings, board),
      (board) => boardScore(board, BeginnerAI.#settings),
    );

    if (!best.move) throw new Error("Minimax didn't return move with score");

    const move = coordToAN(best.move.from) +
      coordToAN(best.move.dest) +
      (best.move.promote ? pieceTypeLetter(best.move.promote) : "");

    console.log(
      "Best Move (%s) = [%s] in %d ms (%d nodes considered)",
      scoreToString(best.score),
      move,
      Date.now() - start,
      best.nodes,
    );

    this.#game.move(move);
  }
}
