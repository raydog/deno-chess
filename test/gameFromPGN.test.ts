import { ChessParseError } from "../src/core/datatypes/ChessError.ts";
import { boardRenderASCII } from "../src/core/logic/boardRenderASCII.ts";
import { gameFromPGN, _lexer } from "../src/core/logic/PGN/gameFromPGN.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Game From PGN > Lexer > Empty string", function () {
  asserts.assertEquals(_lexer(""), []);
});

Deno.test("Game From PGN > Lexer > Standalone chars", function () {
  asserts.assertEquals(_lexer("[]().*"), [
    { type: "[" },
    { type: "]" },
    { type: "(" },
    { type: ")" },
    { type: "." },
    { type: "*" },
  ]);
});

Deno.test("Game From PGN > Lexer > Full-line comment", function () {
  asserts.assertEquals(_lexer("% all of this stuff should be ignored"), []);
  asserts.assertEquals(_lexer("% Comment 1\n% Comment 2\n"), []);
});

Deno.test("Game From PGN > Lexer > Commentary", function () {
  asserts.assertEquals(_lexer("; wow white really sucks at this game"), []);
  asserts.assertEquals(
    _lexer(
      "{ I think black is trying to eat the pieces }{ another { comment }",
    ),
    [],
  );
});

Deno.test("Game From PGN > Lexer > Symbols", function () {
  asserts.assertEquals(
    _lexer(
      "abc Foo 123hello\tNd3 a3-a5\nfoo_bar hello+world# cxd8=Q\r\nlol:olo",
    ),
    [
      { type: "Sym", value: "abc" },
      { type: "Sym", value: "Foo" },
      { type: "Sym", value: "123hello" },
      { type: "Sym", value: "Nd3" },
      { type: "Sym", value: "a3-a5" },
      { type: "Sym", value: "foo_bar" },
      { type: "Sym", value: "hello+world#" },
      { type: "Sym", value: "cxd8=Q" },
      { type: "Sym", value: "lol:olo" },
    ],
  );
});

Deno.test("Game From PGN > Lexer > Integer", function () {
  asserts.assertEquals(_lexer("1 23 4567\n65\t1"), [
    { type: "Int", value: 1 },
    { type: "Int", value: 23 },
    { type: "Int", value: 4567 },
    { type: "Int", value: 65 },
    { type: "Int", value: 1 },
  ]);
});

Deno.test("Game From PGN > Lexer > NAGs", function () {
  asserts.assertEquals(_lexer("$1$40 $139\n\n"), [
    { type: "Nag", value: 1 },
    { type: "Nag", value: 40 },
    { type: "Nag", value: 139 },
  ]);
});

Deno.test("Game From PGN > Lexer > Strings", function () {
  asserts.assertEquals(_lexer('"Foo Bar"'), [
    { type: "Str", value: "Foo Bar" },
  ]);
  asserts.assertEquals(_lexer('"Has \\\\ Backtick"'), [
    { type: "Str", value: "Has \\ Backtick" },
  ]);
  asserts.assertEquals(_lexer(`"Has \\"Quotes\\""`), [
    { type: "Str", value: 'Has "Quotes"' },
  ]);
});

Deno.test("Game From PGN > Lexer > Reject Strings with bad escapes", function () {
  asserts.assertThrows(
    () => _lexer('"Has \\problems"'),
    ChessParseError,
    "Invalid PGN string escape",
  );
});

Deno.test("Game From PGN > Lexer > Reject Strings with EOFs", function () {
  asserts.assertThrows(
    () => _lexer('"Has problems'),
    ChessParseError,
    "String reached the end",
  );
  asserts.assertThrows(
    () => _lexer('"Has problems\\'),
    ChessParseError,
    "String reached the end",
  );
});

Deno.test("Game From PGN > Lexer > Reject Strings with non-printable chars", function () {
  asserts.assertThrows(
    () => _lexer('"Has problems\nohmy"'),
    ChessParseError,
    "can only contain printable ASCII",
  );
});

Deno.test("Game From PGN > Lexer > Basic Tag", function () {
  asserts.assertEquals(_lexer('[ Foo "Bar"]'), [
    { type: "[" },
    { type: "Sym", value: "Foo" },
    { type: "Str", value: "Bar" },
    { type: "]" },
  ]);
});

Deno.test("Game From PGN > Lexer > List of Moves", function () {
  asserts.assertEquals(
    _lexer("1. e4 {Test case} e6 2. d3 Ne7 3. g3 c5 4. Bg2 Nbc6 5. Be3 b6"),
    [
      { type: "Int", value: 1 },
      { type: "." },
      { type: "Sym", value: "e4" },
      { type: "Sym", value: "e6" },
      { type: "Int", value: 2 },
      { type: "." },
      { type: "Sym", value: "d3" },
      { type: "Sym", value: "Ne7" },
      { type: "Int", value: 3 },
      { type: "." },
      { type: "Sym", value: "g3" },
      { type: "Sym", value: "c5" },
      { type: "Int", value: 4 },
      { type: "." },
      { type: "Sym", value: "Bg2" },
      { type: "Sym", value: "Nbc6" },
      { type: "Int", value: 5 },
      { type: "." },
      { type: "Sym", value: "Be3" },
      { type: "Sym", value: "b6" },
    ],
  );
});

Deno.test("Game From PGN > Parser > Sample game from spec", function () {
  // Sample from the spec. Seems like a good place to start.
  const result = gameFromPGN(`
    [Event "F/S Return Match"]
    [Site "Belgrade, Serbia JUG"]
    [Date "1992.11.04"]
    [Round "29"]
    [White "Fischer, Robert J."]
    [Black "Spassky, Boris V."]
    [Result "1/2-1/2"]
    
    1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3
    O-O 9. h3 Nb8 10. d4 Nbd7 11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15.
    Nb1 h6 16. Bh4 c5 17. dxe5 Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21.
    Nc4 Nxc4 22. Bxc4 Nb6 23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7
    27. Qe3 Qg5 28. Qxg5 hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33.
    f3 Bc8 34. Kf2 Bf5 35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5
    40. Rd6 Kc5 41. Ra6 Nf2 42. g4 Bd3 43. Re6 1/2-1/2
  `);
  console.log(result.winner);
  console.log(result.board.current.status);
  console.log(result.tags);
  console.log(boardRenderASCII(result.board, true));
});

Deno.test("Game From PGN > Parser > Sample game from spec", function () {
  // One of (if not THE) longest games to have happened in a Chess championship. Apparently the two weren't on speaking
  // terms, and kept refusing earlier offers to draw, ultimately resulting in Stalemate.
  const result = gameFromPGN(`
    [Event "Karpov - Korchnoi World Championship Match"]
    [Site "City of Baguio PHI"]
    [Date "1978.07.27"]
    [EventDate "?"]
    [Round "5"]
    [Result "1/2-1/2"]
    [White "Viktor Korchnoi"]
    [Black "Anatoly Karpov"]
    [ECO "E42"]
    [WhiteElo "?"]
    [BlackElo "?"]
    [PlyCount "247"]
    
    1. c4 Nf6 2. d4 e6 3. Nc3 Bb4 4. e3 c5 5. Nge2 d5 6. a3 Bxc3+
    7. Nxc3 cxd4 8. exd4 dxc4 9. Bxc4 Nc6 10. Be3 O-O 11. O-O b6
    12. Qd3 Bb7 13. Rad1 h6 14. f3 Ne7 15. Bf2 Nfd5 16. Ba2 Nf4
    17. Qd2 Nfg6 18. Bb1 Qd7 19. h4 Rfd8 20. h5 Nf8 21. Bh4 f6
    22. Ne4 Nd5 23. g4 Rac8 24. Bg3 Ba6 25. Rfe1 Rc6 26. Rc1 Ne7
    27. Rxc6 Qxc6 28. Ba2 Qd7 29. Nd6 Bb7 30. Nxb7 Qxb7 31. Qe3
    Kh8 32. Rc1 Nd5 33. Qe4 Qd7 34. Bb1 Qb5 35. b4 Qd7 36. Qd3 Qe7
    37. Kf2 f5 38. gxf5 exf5 39. Re1 Qf6 40. Be5 Qh4+ 41. Bg3 Qf6
    42. Rh1 Nh7 43. Be5 Qg5 44. Qxf5 Qd2+ 45. Kg3 Nhf6 46. Rg1 Re8
    47. Be4 Ne7 48. Qh3 Rc8 49. Kh4 Rc1 50. Qg3 Rxg1 51. Qxg1 Kg8
    52. Qg3 Kf7 53. Bg6+ Ke6 54. Qh3+ Kd5 55. Be4+ Nxe4 56. fxe4+
    Kxe4 57. Qg4+ Kd3 58. Qf3+ Qe3 59. Kg4 Qxf3+ 60. Kxf3 g6
    61. Bd6 Nf5 62. Kf4 Nh4 63. Kg4 gxh5+ 64. Kxh4 Kxd4 65. Bb8 a5
    66. Bd6 Kc4 67. Kxh5 a4 68. Kxh6 Kb3 69. b5 Kc4 70. Kg5 Kxb5
    71. Kf5 Ka6 72. Ke6 Ka7 73. Kd7 Kb7 74. Be7 Ka7 75. Kc7 Ka8
    76. Bd6 Ka7 77. Kc8 Ka6 78. Kb8 b5 79. Bb4 Kb6 80. Kc8 Kc6
    81. Kd8 Kd5 82. Ke7 Ke5 83. Kf7 Kd5 84. Kf6 Kd4 85. Ke6 Ke4
    86. Bf8 Kd4 87. Kd6 Ke4 88. Bg7 Kf4 89. Ke6 Kf3 90. Ke5 Kg4
    91. Bf6 Kh5 92. Kf5 Kh6 93. Bd4 Kh7 94. Kf6 Kh6 95. Be3+ Kh5
    96. Kf5 Kh4 97. Bd2 Kg3 98. Bg5 Kf3 99. Bf4 Kg2 100. Bd6 Kf3
    101. Bh2 Kg2 102. Bc7 Kf3 103. Bd6 Ke3 104. Ke5 Kf3 105. Kd5
    Kg4 106. Kc5 Kf5 107. Kxb5 Ke6 108. Kc6 Kf6 109. Kd7 Kf7
    110. Be7 Kg8 111. Ke6 Kg7 112. Bc5 Kg8 113. Kf6 Kh7 114. Kf7
    Kh8 115. Bd4+ Kh7 116. Bb2 Kh6 117. Kg8 Kg6 118. Bg7 Kf5
    119. Kf7 Kg5 120. Bb2 Kh6 121. Bc1+ Kh7 122. Bd2 Kh8 123. Bc3+
    Kh7 124. Bg7 1/2-1/2
  `);
  console.log(result.winner);
  console.log(result.board.current.status);
  console.log(result.tags);
  console.log(boardRenderASCII(result.board, true));
});

Deno.test("Game From PGN > Parser > 50 move rule draw", function () {
  // There aren't too many instances of the 50 move rule in the wild, but here's one.
  const result = gameFromPGN(`
    [Event "Rubinstein Memorial 4th"]
    [Site "Polanica-Zdroj POL"]
    [Date "1966.08.25"]
    [EventDate "1966.??.??"]
    [Round "14"]
    [Result "1/2-1/2"]
    [White "Andrzej Filipowicz"]
    [Black "Petar Smederevac"]
    [ECO "A07"]
    [WhiteElo "?"]
    [BlackElo "?"]
    [PlyCount "140"]
    
    1. e4 {Annotation by IM Andrzej Filipowicz} e6 2. d3 Ne7 3. g3 c5 4. Bg2 Nbc6 5. Be3 b6 6. Ne2 d5 7. O-O d4 8. Bc1 g6
    9. Nd2 Bg7 10. f4 f5 11. a3 O-O 12. e5 a5 13. a4 Ba6 14. b3 Rb8 15. Nc4 Qc7 16. Kh1 Nd5 17. Bd2 Rfd8 18. Ng1 Bf8
    19. Nf3 Be7 20. h4 h5 21. Qe2 Ncb4 22. Rfc1 Bb7 23. Kh2 Bc6 24. Na3 Ra8 25. Qe1 Rdb8 26. Qg1 Qb7 27. Qf1 Kg7
    28. Qh1 Qd7 29. Ne1 Ra7 30. Nf3 Rba8 31. Ne1 Bd8 32. Nf3 Rb8 33. Ne1 Bc7 34. Nf3 Rh8 35. Ng5 Bd8 36. Nf3 Be7
    37. Qg1 Bb7 38. Nb5 Raa8 39. Na3 Ba6 40. Qf1 Rab8 41. Nc4 Bd8 42. Qd1 Ne7 43. Nd6 Bc7 44. Qe2 {sealed move} Ng8
    45. Ng5 Nh6 46. Bf3 Bd8 47. Nh3 Ng4+ 48. Kg1 Be7 49. Nc4 Nd5 50. Nf2 Bb7 51. Nh3 Bc6 52. Qg2 Rhc8 53. Re1 Rc7
    54. Re2 Ra7 55. Ree1 Ra6 56. Re2 Rba8 {the game was adjourned for the second time} 57. Ree1 {sealed move} R8a7
    58. Na3 Ra8 59. Nc4 Nh6 60. Na3 Nf7 61. Nf2 Rd8 62. Nc4 Rb8 63. Nh3 Bd8 64. Na3 Ra7 65. Qh1 Bc7 66. Qg2 Rd8
    67. Qh1 Nh6 68. Ng5 Nf7 69. Nh3 Qe8 70. Kh2 Rd7 {I claimed the draw because of the 50 move's rule.} 1/2-1/2
  `);
  console.log(result.winner);
  console.log(result.board.current.status);
  console.log(result.tags);
  console.log(boardRenderASCII(result.board, true));
});

Deno.test("Game From PGN > Parser > Black checkmate", function () {
  // "Game of the Century." This is a SUPER annotated version of the game from lichess.org. Should exercise some of the
  // annotation-ignoring logic...
  const result = gameFromPGN(`
    [Event "Third Rosenwald Trophy"]
    [Site "https://lichess.org/ZAMs9lOM"]
    [Date "1956.10.17"]
    [Round "8"]
    [White "Donald Byrne (?)"]
    [Black "Robert James Fischer (?)"]
    [Result "0-1"]
    [WhiteElo "?"]
    [BlackElo "?"]
    [Variant "Standard"]
    [TimeControl "-"]
    [ECO "A15"]
    [Opening "English Opening: Anglo-Indian Defense, King's Indian Formation"]
    [Termination "Normal"]
    [Annotator "lichess.org"]
    
    1. Nf3 { [%eval 0.31] } 1... Nf6 { [%eval 0.26] } 2. c4 { [%eval 0.09] } 2... g6 { [%eval 0.54] } { A15 English Opening: Anglo-Indian Defense, King's Indian Formation } 3. Nc3 { [%eval 0.29] } 3... Bg7 { [%eval 0.47] } 4. d4 { [%eval 0.39] } 4... O-O { [%eval 0.64] } 5. Bf4 { [%eval 0.15] } 5... d5 { [%eval 0.22] } 6. Qb3 { [%eval -0.05] } 6... dxc4 { [%eval 0.22] } 7. Qxc4 { [%eval -0.02] } 7... c6?! { (-0.02 → 0.53) Inaccuracy. Be6 was best. } { [%eval 0.53] } (7... Be6 8. Qb5 Nc6 9. e3 Nd5 10. Nxd5 Qxd5 11. a3 Na5 12. Qxd5 Bxd5 13. Bxc7 Nb3 14. Rd1) 8. e4 { [%eval 0.42] } 8... Nbd7 { [%eval 0.63] } 9. Rd1 { [%eval 0.65] } 9... Nb6 { [%eval 0.65] } 10. Qc5 { [%eval 0.25] } 10... Bg4 { [%eval 0.35] } 11. Bg5?? { (0.35 → -1.47) Blunder. Be2 was best. } { [%eval -1.47] } (11. Be2 Nfd7 12. Qa3 Bxf3 13. Bxf3 e5 14. dxe5 Qc7 15. Qd6 Qxd6 16. exd6 f5 17. Be3 Nc4) 11... Na4 { [%eval -1.45] } 12. Qa3 { [%eval -1.48] } 12... Nxc3 { [%eval -1.33] } 13. bxc3 { [%eval -1.48] } 13... Nxe4 { [%eval -1.38] } 14. Bxe7 { [%eval -1.52] } 14... Qb6 { [%eval -1.35] } 15. Bc4 { [%eval -1.49] } 15... Nxc3 { [%eval -1.58] } 16. Bc5 { [%eval -2.08] } 16... Rfe8+ { [%eval -2.0] } 17. Kf1 { [%eval -1.84] } 17... Be6 { [%eval -1.79] } 18. Bxb6?? { (-1.79 → -6.59) Blunder. Qxc3 was best. } { [%eval -6.59] } (18. Qxc3 Qxc5) 18... Bxc4+ { [%eval -6.64] } 19. Kg1 { [%eval -6.63] } 19... Ne2+ { [%eval -6.59] } 20. Kf1 { [%eval -6.64] } 20... Nxd4+ { [%eval -6.58] } 21. Kg1 { [%eval -6.6] } 21... Ne2+ { [%eval -6.5] } 22. Kf1 { [%eval -6.54] } 22... Nc3+ { [%eval -6.49] } 23. Kg1 { [%eval -6.53] } 23... axb6 { [%eval -6.43] } 24. Qb4 { [%eval -6.38] } 24... Ra4 { [%eval -6.29] } 25. Qxb6 { [%eval -7.29] } 25... Nxd1 { [%eval -7.05] } 26. h3 { [%eval -8.47] } 26... Rxa2 { [%eval -8.29] } 27. Kh2 { [%eval -8.75] } 27... Nxf2 { [%eval -7.89] } 28. Re1 { [%eval -11.08] } 28... Rxe1 { [%eval -10.74] } 29. Qd8+ { [%eval -10.79] } 29... Bf8 { [%eval -10.52] } 30. Nxe1 { [%eval -10.56] } 30... Bd5 { [%eval -10.18] } 31. Nf3 { [%eval -10.52] } 31... Ne4 { [%eval -10.49] } 32. Qb8 { [%eval -10.39] } 32... b5 { [%eval -9.69] } 33. h4 { [%eval -10.4] } 33... h5 { [%eval -10.13] } 34. Ne5 { [%eval -53.37] } 34... Kg7 { [%eval -50.62] } 35. Kg1?! { (-50.62 → Mate in 16) Checkmate is now unavoidable. Nxf7 was best. } { [%eval #-16] } (35. Nxf7 Kxf7) 35... Bc5+ { [%eval #-16] } 36. Kf1 { [%eval #-5] } 36... Ng3+ { [%eval #-4] } 37. Ke1 { [%eval #-4] } 37... Bb4+ { [%eval #-4] } 38. Kd1 { [%eval #-4] } 38... Bb3+ { [%eval #-3] } 39. Kc1 { [%eval #-3] } 39... Ne2+ { [%eval #-2] } 40. Kb1 { [%eval #-2] } 40... Nc3+ { [%eval #-1] } 41. Kc1 { [%eval #-1] } 41... Rc2# { Black wins by checkmate. } 0-1
  `);
  console.log(result.winner);
  console.log(result.board.current.status);
  console.log(result.tags);
  console.log(boardRenderASCII(result.board, true));
});


