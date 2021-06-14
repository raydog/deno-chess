// Note: esbuild doesn't handle multiple entrypoints having their own global names AFAICT, so have the dev server
// just hoist all this stuff into a single file:

export * as DenoChess from "./denochess.ts";
export * as DenoChessAI from "./denochess.ai.ts"
