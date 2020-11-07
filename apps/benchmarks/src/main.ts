import * as Benchmark from 'benchmark';
import { Event, Suite, Target } from 'benchmark';
import * as fs from 'fs';
import { getJunitXml, TestSuite, TestSuiteReport } from 'junit-xml';

import config from '../benchmark.config';

type NameableSuite = Suite & Nameable;
type NameableBenchmark = Benchmark & Nameable;

interface Nameable {
  name: string;
}

const suites: Suite[] = [];
const report: TestSuiteReport = {
  name: config.suiteName,
  time: 0,
  suites: [],
};

export function suite(name: string, benchmarksFn: () => void): void {
  const newSuite = new Suite(name);
  suites.push(newSuite);

  newSuite.on('complete', (event: Event) => {
    const suite = event.currentTarget as Suite;
    logSummary(suite);

    report.suites.push(convertToTestSuite(name, suite));

    if (everySuiteFinished()) {
      sumUpTotalTime();

      writeReportToFile();
    }
  });

  benchmarksFn();

  newSuite.run({ async: true });
}

export function benchmark(name: string, fn: () => void): void {
  suites[suites.length - 1].add(name, fn);
}

function logSummary(suiteToLog: Suite): void {
  logFastestBenchmarkNames(suiteToLog);

  const benchmarks = toBenchmarks(suiteToLog);
  const descSortedBenchmarks = benchmarks.sort((a, b) => b.hz - a.hz);
  const highestHz = descSortedBenchmarks[0].hz;

  descSortedBenchmarks.forEach(bm => {
    logBenchmarkBar(highestHz, bm);
  });
}

function logFastestBenchmarkNames(suiteToLog: Suite): void {
  const fastestBenchmarkNames = suiteToLog.filter('fastest').map((bm: Target) => bm.name);
  const conjugatedVerbBe = fastestBenchmarkNames.length > 1 ? 'are' : 'is';

  console.log(`\n${(suiteToLog as NameableSuite).name}`);
  console.log(`  Fastest ${conjugatedVerbBe} "${fastestBenchmarkNames.join(', ')}"`);
}

function logBenchmarkBar(highestHz: number, bm: Benchmark): void {
  const barPercentage = (100 / highestHz) * bm.hz;
  const charsPerOnePercentage = 4;

  const filledBarLength = barPercentage / charsPerOnePercentage;
  const emptyBarLength = (100 - barPercentage) / charsPerOnePercentage;

  const createBar = (length: number, char: string): string =>
    Array.from({ length }, () => char).join('');
  const filledBar = `${createBar(Math.floor(filledBarLength), '-')}`;
  const emptyBar = createBar(Math.ceil(emptyBarLength), ' ');

  console.log(`  |${filledBar}${emptyBar}| ${bm}`);
}

function convertToTestSuite(suiteName: string, currentSuite: Suite): TestSuite {
  const benchmarks = toBenchmarks(currentSuite);

  return {
    name: suiteName,
    time: benchmarks.map(bm => bm.stats.mean).reduce((previous, current) => previous + current, 0),
    testCases: benchmarks.map(bm => ({
      classname: suiteName,
      name: (bm as NameableBenchmark).name,
      time: bm.stats.mean,
    })),
    timestamp: new Date(benchmarks[0].times.timeStamp),
  };
}

function toBenchmarks(suite: Suite): Benchmark[] {
  const benchmarks: Benchmark[] = [];
  suite.forEach((bm: Benchmark) => {
    benchmarks.push(bm);
  });

  return benchmarks;
}

function sumUpTotalTime(): void {
  report.time = report.suites
    .map(s => s.time)
    .reduce((previous, current) => (previous && current ? previous + current : 0), 0);
}

function everySuiteFinished(): boolean {
  return suites.every(s => !s.running);
}

function writeReportToFile(): void {
  const folderPath = `${process.cwd()}/${config.outputDirectory}`;
  const filePath = `${config.outputDirectory}/${config.outputName}`;

  fs.promises
    .mkdir(folderPath, { recursive: true })
    .then(() => fs.promises.writeFile(filePath, getJunitXml(report)))
    .then(() => console.log(`\nJUnit report saved:\n ${filePath}`))
    .catch((err: NodeJS.ErrnoException) => {
      console.log(err);
      process.exit(err.errno);
    });
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
declare const require: any;

(function runAllBenchmarks(): void {
  // find all benchmark files
  const context = require.context('./', true, /\.benchmark\.ts$/);
  // Load the modules.
  console.log('Found benchmarks:');
  context.keys().map((key: string) => {
    console.log(`- ${key}`);
    context(key);
  });
})();
