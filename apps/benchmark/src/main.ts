import { Suite } from 'benchmark';

const suites: Suite[] = [];

export function suite(name: string, benchmarks: () => void): void {
  const newSuite = new Suite(name);
  suites.push(newSuite);

  let cycleLog = '';
  newSuite.on('cycle', event => {
    cycleLog += `  - ${event.target}\n`;
  });
  newSuite.on('complete', () => {
    const fastestBenchmarkName = newSuite.filter('fastest').map(bm => bm.name);
    console.log(name);
    console.log(`  Fastest is ${fastestBenchmarkName}\n${cycleLog}`);
  });

  benchmarks();

  newSuite.run({ async: true });
}

export function benchmark(name: string, fn: () => void): void {
  suites[suites.length - 1].add(name, fn);
}

declare const require: any;
(function runAllBenchmarks(): void {
  // find all benchmark files
  const context = require.context('./', true, /\.benchmark\.ts$/);
  // Load the modules.
  context.keys().map(context);
})();
