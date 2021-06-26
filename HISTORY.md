## 0.4.0 (WIP)

- Fixed a bug where pawn promotions weren't counted as pawn moves, so it
  wouldn't reset the 50-move counter.
- Added the ability to undo moves.
- PGN parser is now both slightly faster and slightly smaller. (In terms of size
  in the dist bundle.)

## 0.3.0 (2021-06-22)

- (Breaking) The format of the move list when asking for a list of all legal
  moves was changed.
  - Moves that involve promoting a pawn are now treated as different moves.
  - The move object now has a "promotion" string property, which is the piece
    type ("Q", "N", ...) that this move promotes to.
- (Breaking) The format of the move method changed. There is no longer a
  promotion second parameter, and UCI promotions are now part of the string.
- Move lists are now cached when listing legal moves.
- Various tweaks to the work-in-progress AI.
- AI logic is now packaged into a different module from the core chess engine.
- Fixed a minor bug in PGN parsing.

## 0.2.1 (2021-06-12)

- Fix a move enumeration bug, that would allow the King to castle when not
  appropriate.
- Slight performance improvement with move enumeration.

## 0.2.0 (2021-06-12)

- Basic PGN import & export support.
- allMoves() now returns objects instead of strings.

## 0.1.0 (2021-06-07)

- Initial release.
- Can validate and perform moves. (UCI and SAN)
- Check + Checkmate + Draw condition detection.
- FEN import & export.
- Basic board rendering.
- Basic AI.
