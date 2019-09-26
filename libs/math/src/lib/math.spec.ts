/**
 * @jest-environment node
 */

// const Benchmark = require('benchmark');
import Benchmark from 'benchmark';

describe('Integer division', () => {
  it('Integer division', done => {
    // console.log('benchmark', Benchmark);
    // console.log('suite', Benchmark.Suite);

    suite('Test Suite', () => {
      benchmark('Test Benchmark', () => {});
    });
  });
});

// suite('Integer division', () => {
//   benchmark('Math.round()', () => {});
//   benchmark('Math.round()', () => {});
// });

const suites = [];

function suite(name: string, fn: Function): void {
  const newSuite = new Benchmark.Suite(name);
  suites.push(newSuite);
}

function benchmark(name: string, fn: Function): void {
  console.log('this', this.prototype.suite);
}

class Suite {}

// describe('Math', () => {
//   it('should determine if number is power of two', () => {
//     expect(isPowerOfTwo(1)).toBeTruthy();
//     expect(isPowerOfTwo(2)).toBeTruthy();
//     expect(isPowerOfTwo(4)).toBeTruthy();
//     expect(isPowerOfTwo(8)).toBeTruthy();
//     expect(isPowerOfTwo(16)).toBeTruthy();
//   });
//
//   it('should determine if number is NOT power of two', () => {
//     expect(isPowerOfTwo(3)).toBeFalsy();
//     expect(isPowerOfTwo(5)).toBeFalsy();
//     expect(isPowerOfTwo(7)).toBeFalsy();
//     expect(isPowerOfTwo(-8)).toBeFalsy();
//   });
// });

// describe.skip('Integer division', () => {
//   it('Integer division', done => {
//     const suite = new Suite('Integer division')
//       .add('Math.round()', () => {
//         Math.floor(10 / 2);
//         Math.floor(11 / 3);
//         Math.floor(12 / 5);
//       })
//       .add('a/b >> 0', () => {
//         (10 / 2) >> 0;
//         (11 / 3) >> 0;
//         (12 / 5) >> 0;
//       })
//       .add('~~(a/b)', () => {
//         ~~(10 / 2);
//         ~~(11 / 3);
//         ~~(12 / 5);
//       })
//       // .add('a/b | 0', () => {
//       //   (10 / 2) | 0;
//       //   (11 / 3) | 0;
//       //   (12 / 5) | 0;
//       // })
//       .on('complete', () => {
//         console.log('Fastest is ' + suite.filter('fastest').map('name'));
//         done();
//       })
//       .run({ async: true });
//   }, 40000);
// });
