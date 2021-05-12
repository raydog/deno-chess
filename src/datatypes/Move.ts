// import { Coord } from "./Coord.ts";
// import { PieceType } from "./Piece";

// type MoveMeta = {
//   takes?: string,
//   promoted?: string,
// }

// type CaptureData = {
//   /**
//    * The piece type (P, R, B, ...) that was captured.
//    */
//   what: string;

//   /**
//    * Where the piece was captured. This may differ from `move.to` with en passants.
//    */
//   where: Coord;
// };

// export class Move {

//   /**
//    * The piece type (Pawn, Rook, ...) that moved.
//    */
//   readonly what: PieceType;

//   /**
//    * The starting square for the piece.
//    */
//   readonly from: Coord;

//   /**
//    * The ending squre for the piece.
//    */
//   readonly to: Coord;

//   /**
//    * Details on the capture, if this is a capture.
//    */
//   readonly capture: CaptureData | null;

//   /**
//    * The piece type (Q, K, ...) that a pawn promoted to, if this is a promotion.
//    */
//   readonly promotion: string | null;

//   // Internal constructor:
//   protected constructor(
//     what: string,
//     from: Coord,
//     to: Coord,
//     capture: CaptureData | null,
//     promotion: string | null
//   ) {
//     this.what = what;
//     this.from = from;
//     this.to = to;
//     this.capture = capture;
//     this.promotion = promotion;
//   }

//   // static Move(what: string, from: Coord, to: Coord) {

//   // }

//   // static NormalCapture(what: wtring, from: Coord, to: Coord, )



//   get isCastle(): boolean {
//     if (this.what !== "K") { return false; }
//     if (this.from[0] !== this.to[0]) { return false; }
//     const diff = Math.abs(this.from[1] - this.to[1]);
//     return diff === 2;
//   }
// }
