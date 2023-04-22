import { ChessGame } from "../../mod.ts";
import { bench, runBenchmarks } from "../../testDeps.ts";

// A good, complex game, with a lot to render:
const game = ChessGame.NewFromPGN(`[Event "Belgrade"]
[Site "Belgrade YUG"]
[Date "1989.02.17"]
[EventDate "?"]
[Round "?"]
[Result "1/2-1/2"]
[White "Ivan Nikolic"]
[Black "Goran Arsovic"]
[ECO "E95"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "538"]

1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 Nbd7 7.O-O
e5 8.Re1 Re8 9.Bf1 h6 10.d5 Nh7 11.Rb1 f5 12.Nd2 f4 13.b4 g5
14.Nb3 Bf8 15.Be2 Ndf6 16.c5 g4 17.cxd6 cxd6 18.a3 Ng5 19.Bf1
Re7 20.Qd3 Rg7 21.Kh1 Qe8 22.Nd2 g3 23.fxg3 fxg3 24.Qxg3 Nh3
25.Qf3 Qg6 26.Nc4 Bd7 27.Bd3 Ng5 28.Bxg5 Qxg5 29.Ne3 Re8
30.Ne2 Be7 31.Rbd1 Rf8 32.Nf5 Ng4 33.Neg3 h5 34.Kg1 h4 35.Qxg4
Qxg4 36.Nh6+ Kh7 37.Nxg4 hxg3 38.Ne3 gxh2+ 39.Kxh2 Rh8 40.Rh1
Kg6+ 41.Kg1 Rc8 42.Be2 Rc3 43.Rd3 Rc1+ 44.Nf1 Bd8 45.Rh8 Bb6+
46.Kh2 Rh7+ 47.Rxh7 Kxh7 48.Nd2 Bg1+ 49.Kh1 Bd4+ 50.Nf1 Bg4
51.Bxg4 Rxf1+ 52.Kh2 Bg1+ 53.Kh3 Re1 54.Bf5+ Kh6 55.Kg4 Re3
56.Rd1 Bh2 57.Rh1 Rg3+ 58.Kh4 Rxg2 59.Kh3 Rg3+ 60.Kxh2 Rxa3
61.Rg1 Ra6 62.Rg6+ Kh5 63.Kg3 Rb6 64.Rg7 Rxb4 65.Bc8 a5
66.Bxb7 a4 67.Bc6 a3 68.Ra7 Rb3+ 69.Kf2 Kg5 70.Ke2 Kf4 71.Ra4
Rh3 72.Kd2 a2 73.Bb5 Rh1 74.Rxa2 Rh2+ 75.Be2 Kxe4 76.Ra5 Kd4
77.Ke1 Rh1+ 78.Kf2 Rc1 79.Bg4 Rc2+ 80.Ke1 e4 81.Be6 Ke5 82.Bg8
Rc8 83.Bf7 Rc7 84.Be6 Rc2 85.Ra8 Rb2 86.Ra6 Rg2 87.Kd1 Rb2
88.Ra5 Rg2 89.Bd7 Rh2 90.Bc6 Kf4 91.Ra8 e3 92.Re8 Kf3 93.Rf8+
Ke4 94.Rf6 Kd3 95.Bb5+ Kd4 96.Rf5 Rh1+ 97.Ke2 Rh2+ 98.Kd1 Rh1+
99.Kc2 Rh2+ 100.Kc1 Rh1+ 101.Kc2 Rh2+ 102.Kd1 Rh1+ 103.Ke2
Rh2+ 104.Kf1 Rb2 105.Be2 Ke4 106.Rh5 Rb1+ 107.Kg2 Rb2 108.Rh4+
Kxd5 109.Kf3 Kc5 110.Kxe3 Rb3+ 111.Bd3 d5 112.Rh8 Ra3 113.Re8
Kd6 114.Kd4 Ra4+ 115.Kc3 Ra3+ 116.Kd4 Ra4+ 117.Ke3 Ra3 118.Rh8
Ke5 119.Rh5+ Kd6 120.Rg5 Rb3 121.Kd2 Rb8 122.Bf1 Re8 123.Kd3
Re5 124.Rg8 Rh5 125.Bg2 Kc5 126.Rf8 Rh6 127.Bf3 Rd6 128.Re8
Rc6 129.Ra8 Rb6 130.Rd8 Rd6 131.Rf8 Ra6 132.Rf5 Rd6 133.Kc3
Rd8 134.Rg5 Rd6 135.Rh5 Rd8 136.Rf5 Rd6 137.Rf8 Ra6 138.Re8
Rc6 139.Ra8 Rb6 140.Ra5+ Rb5 141.Ra1 Rb8 142.Rd1 Rd8 143.Rd2
Rd7 144.Bg2 Rd8 145.Kd3 Ra8 146.Ke3 Re8+ 147.Kd3 Ra8 148.Kc3
Rd8 149.Bf3 Rd7 150.Kd3 Ra7 151.Bg2 Ra8 152.Rc2+ Kd6 153.Rc3
Ra2 154.Bf3 Ra8 155.Rb3 Ra5 156.Ke3 Ke5 157.Rd3 Rb5 158.Kd2
Rc5 159.Bg2 Ra5 160.Bf3 Rc5 161.Bd1 Rc8 162.Bb3 Rc5 163.Rh3
Kf4 164.Kd3 Ke5 165.Rh5+ Kf4 166.Kd4 Rb5 167.Bxd5 Rb4+ 168.Bc4
Ra4 169.Rh7 Kg5 170.Rf7 Kg6 171.Rf1 Kg5 172.Kc5 Ra5+ 173.Kc6
Ra4 174.Bd5 Rf4 175.Re1 Rf6+ 176.Kc5 Rf5 177.Kd4 Kf6 178.Re6+
Kg5 179.Be4 Rf6 180.Re8 Kf4 181.Rh8 Rd6+ 182.Bd5 Rf6 183.Rh1
Kf5 184.Be4+ Ke6 185.Ra1 Kd6 186.Ra5 Re6 187.Bf5 Re1 188.Ra6+
Ke7 189.Be4 Rc1 190.Ke5 Rc5+ 191.Bd5 Rc7 192.Rg6 Rd7 193.Rh6
Kd8 194.Be6 Rd2 195.Rh7 Ke8 196.Kf6 Kd8 197.Ke5 Rd1 198.Bd5
Ke8 199.Kd6 Kf8 200.Rf7+ Ke8 201.Rg7 Rf1 202.Rg8+ Rf8 203.Rg7
Rf6+ 204.Be6 Rf2 205.Bd5 Rf6+ 206.Ke5 Rf1 207.Kd6 Rf6+ 208.Be6
Rf2 209.Ra7 Kf8 210.Rc7 Rd2+ 211.Ke5 Ke8 212.Kf6 Rf2+ 213.Bf5
Rd2 214.Rc1 Rd6+ 215.Be6 Rd2 216.Rh1 Kd8 217.Rh7 Rd1 218.Rg7
Rd2 219.Rg8+ Kc7 220.Rc8+ Kb6 221.Ke5 Kb7 222.Rc3 Kb6 223.Bd5
Rh2 224.Kd6 Rh6+ 225.Be6 Rh5 226.Ra3 Ra5 227.Rg3 Rh5 228.Rg2
Ka5 229.Rg3 Kb6 230.Rg4 Rb5 231.Bd5 Rc5 232.Rg8 Rc2 233.Rb8+
Ka5 234.Bb3 Rc3 235.Kd5 Rc7 236.Kd4 Rd7+ 237.Bd5 Re7 238.Rb2
Re8 239.Rb7 Ka6 240.Rb1 Ka5 241.Bc4 Rd8+ 242.Kc3 Rh8 243.Rb5+
Ka4 244.Rb6 Rh3+ 245.Bd3 Rh5 246.Re6 Rg5 247.Rh6 Rc5+ 248.Bc4
Rg5 249.Ra6+ Ra5 250.Rh6 Rg5 251.Rh4 Ka5 252.Rh2 Rg3+ 253.Kd4
Rg5 254.Bd5 Ka4 255.Kc5 Rg3 256.Ra2+ Ra3 257.Rb2 Rg3 258.Rh2
Rc3+ 259.Bc4 Rg3 260.Rb2 Rg5+ 261.Bd5 Rg3 262.Rh2 Rc3+ 263.Bc4
Rg3 264.Rh8 Ka3 265.Ra8+ Kb2 266.Ra2+ Kb1 267.Rf2 Kc1 268.Kd4
Kd1 269.Bd3 Rg7 1/2-1/2`);

// console.log(game.toString("pgn"));

bench({
  name: "Generate PGN file",
  runs: 1000,
  func(b) {
    b.start();
    game.toString("pgn");
    b.stop();
  },
});

runBenchmarks();
