// Rate a move. Basically, prioritize captures first
export function listOrderedMoves({}: ScoreSettings): number {

  const allMoves = listAllValidMoves(board, color);
  const orderedMoves = [...allMoves].sort(compareMoves);

  return spaceGetType(b.capture) - spaceGetType(a.capture);
}
