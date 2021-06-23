import { gameFromPGN } from "../../src/core/logic/PGN/gameFromPGN.ts";
import { bench, runBenchmarks } from "../../testDeps.ts";

const pgn = `[Event "Rubinstein Memorial 4th"]
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
67. Qh1 Nh6 68. Ng5 Nf7 69. Nh3 Qe8 70. Kh2 Rd7 {I claimed the draw because of the 50 move's rule.} 1/2-1/2`;

bench({
  name: "Parse PGN file",
  runs: 500,
  func(b) {
    b.start();
    gameFromPGN(pgn);
    b.stop();
  },
});

runBenchmarks();
