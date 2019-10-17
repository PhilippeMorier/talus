/**
 * @jest-environment node
 */

import { Suite } from 'benchmark';

const suites: Suite[] = [];

function suite(name: string, benchmarks: () => void): void {
  it(name, () => {
    const newSuite = new Suite(name);
    suites.push(newSuite);

    let cycleLog = '';
    newSuite.on('cycle', event => {
      cycleLog += `  - ${event.target}\n`;
    });
    newSuite.on('complete', () => {
      const fastestBenchmarkName = newSuite.filter('fastest').map(bm => bm.name);
      console.log(`Fastest is ${fastestBenchmarkName}\n${cycleLog}`);
    });

    benchmarks();

    newSuite.run();
  });
}

function benchmark(name: string, fn: () => void): void {
  suites[suites.length - 1].add(name, fn);
}

suite('Integer division', () => {
  benchmark('Math.floor()', () => {
    Math.floor(10 / 2);
    Math.floor(11 / 3);
    Math.floor(12 / 5);
  });

  benchmark('a/b >> 0', () => {
    (10 / 2) >> 0;
    (11 / 3) >> 0;
    (12 / 5) >> 0;
  });

  benchmark('~~(a/b)', () => {
    ~~(10 / 2);
    ~~(11 / 3);
    ~~(12 / 5);
  });

  benchmark('a/b | 0', () => {
    (10 / 2) | 0;
    (11 / 3) | 0;
    (12 / 5) | 0;
  });
});
