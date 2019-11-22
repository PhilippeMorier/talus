import { Suite } from 'benchmark';

const suites: Suite[] = [];

export function suite(name: string, benchmarksFn: () => void): void {
  const newSuite = new Suite(name);
  suites.push(newSuite);

  newSuite.on('complete', event => logSummary(event.currentTarget));

  benchmarksFn();

  newSuite.run({ async: true });
}

export function benchmark(name: string, fn: () => void): void {
  suites[suites.length - 1].add(name, fn);
}

function logSummary(suiteToLog: any): void {
  const fastestBenchmarkName = suiteToLog.filter('fastest').map(bm => bm.name);
  const conjugatedVerbBe = fastestBenchmarkName.length > 1 ? 'are' : 'is';
  console.log(suiteToLog.name);
  console.log(`  Fastest ${conjugatedVerbBe} [${fastestBenchmarkName.join(', ')}]`);

  const benchmarks = Array.from({ length: suiteToLog.length }, (x, i) => suiteToLog[i]);
  const descSortedBenchmarks = benchmarks.sort((a, b) => b.hz - a.hz);
  const highestHz = descSortedBenchmarks[0].hz;

  descSortedBenchmarks.forEach(bm => {
    const barPercentage = (100 / highestHz) * bm.hz;
    const charsPerOnePercentage = 2;

    const filledBarLength = barPercentage / charsPerOnePercentage;
    const emptyBarLength = (100 - barPercentage) / charsPerOnePercentage;

    const createBar = (length, char) => Array.from({ length }, () => char).join('');
    const filledBar = `${createBar(Math.floor(filledBarLength), '-')}`;
    const emptyBar = createBar(Math.ceil(emptyBarLength), ' ');

    console.log(`  |${filledBar}${emptyBar}| ${bm}`);
  });
}

declare const require: any;
(function runAllBenchmarks(): void {
  // find all benchmark files
  const context = require.context('./', true, /\.benchmark\.ts$/);
  // Load the modules.
  context.keys().map(context);
})();
