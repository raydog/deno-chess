// Deno (and esbuild for that matter) treat const enums as standard enums, for simplicity reasons.
// So, I guess we have to DIY for the time being...

// export const enum Color {
//   White = 0,
//   Black = 1,
// }

export type Color = number;
export const COLOR_WHITE = 0;
export const COLOR_BLACK = 1;
