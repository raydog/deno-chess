export enum Color {
  White = 0,
  Black = 1,
}

export function colorToString(c: Color): string {
  return c === Color.White ? "White" : "Black";
}
