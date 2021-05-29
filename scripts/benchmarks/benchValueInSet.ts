import { bench, runBenchmarks } from "../../testDeps.ts";

const LOOP = 1_000_000;

bench({
  name: "Object",
  runs: 1000,
  func(b) {
    
    const set: { [x: number]: true } = { 1: true, 3: true, 5: true };

    b.start();
    for (let i = 0; i < LOOP; i++) {
      for (let test=1; test<6; test++) {
        if (set[test] === true) {
          // Do a thing.
        }
      }
    }
    b.stop();
  },
});

bench({
  name: "Array",
  runs: 1000,
  func(b) {
    
    const set = [false, true, false, true, false, true];

    b.start();
    for (let i = 0; i < LOOP; i++) {
      for (let test=1; test<6; test++) {
        if (set[test] === true) {
          // Do a thing.
        }
      }
    }
    b.stop();
  },
});

bench({
  name: "Bit-field",
  runs: 1000,
  func(b) {
    
    const set = 0b0101010;
    b.start();
    for (let i = 0; i < LOOP; i++) {
      for (let test=1; test<6; test++) {
        if (set & (1 << test)) {
          // Do a thing.
        }
      }
    }
    b.stop();
  },
});

// Slow AF

// bench({
//   name: "Set",
//   runs: 1000,
//   func(b) {
    
//     const set = new Set([1, 3, 5]);

//     b.start();
//     for (let i = 0; i < LOOP; i++) {
//       for (let test=1; test<6; test++) {
//         if (set.has(test)) {
//           // Do a thing.
//         }
//       }
//     }
//     b.stop();
//   },
// });

runBenchmarks();
