import { Suite } from 'benchmark';

const suites: Suite[] = [];

export function suite(name: string, benchmarksFn: () => void): void {
  const newSuite = new Suite(name);
  suites.push(newSuite);

  newSuite.on('complete', event => {
    const fastestBenchmarkName = newSuite.filter('fastest').map(bm => bm.name);
    const conjugatedVerbBe = fastestBenchmarkName.length > 1 ? 'are' : 'is';

    console.log(name);
    console.log(`  Fastest ${conjugatedVerbBe} [${fastestBenchmarkName.join(', ')}]`);

    const currentSuite = event.currentTarget;
    const benchmarks = Array.from({ length: currentSuite.length }, (x, i) => currentSuite[i]);
    benchmarks.forEach(bm => console.log(`  - ${bm}`));
  });

  benchmarksFn();

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
