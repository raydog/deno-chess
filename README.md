# Deno-Chess [![Build Status](https://github.com/raydog/deno-chess/actions/workflows/deno.yml/badge.svg?branch=main)](https://github.com/raydog/deno-chess/actions)

![Deno dressed as a king](./data/king-deno.png)

Deno-Chess is a speedy pure-Typescript chess engine. It is packaged for Deno, as
well as for the browser. Features include:

- Move generation / validation, piece logic, check / checkmate detection, draw
  detection, etc. All the standard Chess-engine stuff.
- Can both read and write
  [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) strings.
- Can both read and write
  [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation) strings.
- Fast! the game core is built on top of typed arrays, and a whole bunch of
  bit-math. In the end, it's roughly 10x faster than Chess.js.

## Example

```ts
import { ChessGame } from "https://deno.land/x/chess@0.6.0/mod.ts";

// Start a new game:
const game = ChessGame.NewStandardGame();

// Moves can be done with an object:
game.move({ from: "e2", dest: "e4" });

// ... Or in UCI "{from}{dest}" format:
game.move("b8c6");

// ... Or in Standard Algebraic Notation:
game.move("Nf3");

// Check if the game is over with:
game.isGameOver();
// => false

// Check the status of the game like so:
game.getStatus();
// => { state: "active", turn: "white" }

// Enumerate all moves available to the player with:
game.allMoves();
// => [
//      { from: "b1", dest: "a3" },
//      { from: "b1", dest: "c3" },
//      ...
//    ]

// Do you want to render the board in text? Use .toString()
game.toString();
/*
     a  b  c  d  e  f  g  h
   +------------------------+
 8 | r     b  q  k  b  n  r | 8
 7 | p  p  p  p  p  p  p  p | 7
 6 |       n                | 6
 5 |                        | 5
 4 |             P          | 4
 3 |                N       | 3
 2 | P  P  P  P     P  P  P | 2
 1 | R  N  B  Q  K  B     R | 1
   +------------------------+
     a  b  c  d  e  f  g  h
*/

// .toString() also lets you export FEN strings:
game.toString("fen");
// => "r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2"

// ... Or PGN strings:
game.toString("pgn");
/*
[Event "?"]
[Site "?"]
[Date "2021.07.05"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "*"]

1. e4 Nc6 2. Nf3 *
*/
```

## Game API

Most of the game features are provided by the ChessGame class.

### Starting a game

- **`ChessGame.NewStandardGame()`**

  Create a new chess game, in the standard setup.

- **`ChessGame.NewFromFEN(fen: string)`**

  Create a new chess game, using the provided FEN string as a starting point.

- **`ChessGame.NewFromPGN(pgn: string)`**

  Create a new chess game, using the provided PGN game as a starting point.

### Playing a game

- **`game.move(move: string | { from, dest, promotion? })`**

  Performs a chess move.

  The "move" parameter can either be an object describing the move, or a short
  string in either
  [UCI (Universal Chess Interface)](https://en.wikipedia.org/wiki/Universal_Chess_Interface)
  format, or in the more human-friendly
  [SAN (Standard Algebraic Notation)](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))
  format.

  - _Object Format_
    ```ts
    game.move({ from: "g8", dest: "f6" }); // Move g8 to f6
    game.move({ from: "c7", dest: "c8", promotion: "Q"); // Move the white pawn on c7 to c8 ; Promote to Queen
    ```

  - _UCI Format_

    ```ts
    game.move("g8f6"); // Move the black knight on g8 to f6
    game.move("c7c8Q"); // Move the white pawn on c7 to c8 ; Promote to Queen
    ```

  - _SAN Format_

    ```ts
    game.move("Raxd1"); // Use the a-file rook to capture on d1
    game.move("b1=N"); // Move a pawn to b1 ; Promote to a Knight
    ```

  Note: If a pawn reaches its final rank, and promotion info wasn't indicated, a
  `ChessNeedsPromotion` error is thrown.

- **`game.allMoves(coord?: string)`**

  Returns all available moves for the current player. If a coordinate is
  provided, only moves for the piece at that coord will be returned. If that
  space is either empty, or holds a piece that belongs to the other player, an
  empty array will be returned.

  Moves are described as objects with these properties:

  - `from`: The departure coordinate, in algebraic notation.
  - `dest`: The destination coordinate, in algebraic notation.
  - `promotion`: Present when this is a promotion. Will be equal to one of: "Q",
    "R", "N", or "B".

- **`game.isGameOver()`**

  Returns true if this game is over, and no further moves can be provided.

- **`game.getStatus()`**

  Returns an object that describes the game's status. Has these properties:

  - `state`: One of the following strings:
    - `"active"` - The game is still going
    - `"checkmate"` - The current player was checkmated.
    - `"resigned"` - A player resigned.
    - `"draw-other"` - A draw was declared, for some reason.
    - `"draw-stalemate"` - The current player is in stalemate: They have no
      moves available to them, but they aren't in check.
    - `"draw-repetition"` - The game was drawn since the same board position
      came up 3 different times.
    - `"draw-fifty-moves"` - The game was drawn, since it's been 50 full moves
      since the last capture or pawn advancement.
    - `"draw-no-material"` - The game was drawn, since there just isn't enough
      material on the boart to deliver a checkmate.
  - `turn`: Who's turn is it to play? Either `"white"` or `"black"`.
  - `winner`: If the game is in a final (ie: not `"active"`) state, this
    property will be included, and will be one of: `"white"`, `"black"`, or
    `"draw"`.
  - `reason`: If the game was drawn for some "other" reason, and that reason was
    provided, this property will be included to give that reason.

- **`game.history()`**

  Returns all moves in the game history.

- **`game.undoMove()`**

  Undoes the most recent move in the history.

- **`game.resignGame(player: "white" | "black")`**

  The given player has resigned the game, meaning that the OTHER player wins.

- **`game.drawGame(reason?: string)`**

  The game was drawn. A reason can be provided.

### Checking on the board

- **`game.getSpace(coord: string)`**

  Will return an object that describes a space on the board. Has these
  properties:
  - `coord`: the space's coordinate.
  - `piece`: an object describing the piece. Only included if a piece is here.
    Properties:
    - `color`: the piece's color. (Either `"white"` or `"black"`.)
    - `pieceType`: the piece's type. (One of: `"P"`, `"B"`, `"N"`, `"R"`, `"Q"`,
      or `"K"`.)

### Tags

Keeping tags for your game can be useful when exporting in PGN format. By
default, Deno-Chess will add a "Date" tag, equal to the YYYY.MM.DD when you
called the constructor. You can manage your tags with:

- **`game.getTags()`**

  Get all tags current stored for this game. Returns an object, mapping from
  string Names to string Values.

- **`game.setTag(name: string, value: null | string | boolean | number | Date)`**

  Set a single tag to be equal to the given value. Use `null` to clear a prior
  tag value. Booleans are coerced to either "0" or "1". Numbers are stringified.
  And Dates are formatted in "YYYY.MM.DD" format, according to the local
  timezone. (Or "????.??.??" if the Date is invalid...)

### Outputting a string

- **`game.toString(format = "ascii")`**

  Will return the game as a string, in the given format. (Default is "ascii")

  - `"ascii"` - A simple plain-text format.

    ```
    ____a  b  c  d  e  f  g  h
      +------------------------+
    8 | r  n  b  q  k  b  n  r | 8
    7 | p  p  p  p  p  p  p  p | 7
    6 |                        | 6
    5 |                        | 5
    4 |                        | 4
    3 |                        | 3
    2 | P  P  P  P  P  P  P  P | 2
    1 | R  N  B  Q  K  B  N  R | 1
      +------------------------+
        a  b  c  d  e  f  g  h
    ```

  - `"terminal"` - The same as ascii, but with ANSI color codes that make the
    output look cool in a terminal.

  - `"fen"` - Output in
    [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)
    format.

    ```
    rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
    ```

  - `"pgn"` - Output in
    [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation) format.

    ```pgn
    [Event "Example game for \"README.md\""]
    [Site "?"]
    [Date "2021.06.11"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "1-0"]

    1. e4 e5 2. Bc4 Bc5 3. Qf3 d6 4. Qxf7# 1-0
    ```

## Adding AI

_(Note: This bit is subject to change)_

This project has a pretty easy (and also pretty slow) AI, that is being casually
worked on, but will probably never get _too_ advanced. It uses a minimax move
search algorithm, with alpha-beta pruning, but no quiescence search, and no
iterative deepening. This partly stems from the fact that it can only check ~15k
positions per second, so move searches (given that it typically looks 4-ply, or
2 solid moves ahead) can take a while. Still, if you want to try it out:

```ts
import { BeginnerAI, ChessGame } from "https://deno.land/x/chess@0.6.0/mod.ts";

const game = ChessGame.NewStandardGame();
const ai = BeginnerAI.NewForGame(game, "black");

// And whenever it's the AI's turn to play:
ai.takeTurn();
```

### TODO:

Some things that I plan on getting to:

- [ ] Slightly better AI.
- [ ] Openings database. (Probably available as a separate module, to keep the
      main module size small.)
- [ ] Ability to connect with UCI-compatible engines.

## License

MIT
