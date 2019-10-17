/**
 * @jest-environment node
 */

import { Suite } from 'benchmark';

const suite = new Suite();

describe('Integer division', () => {
  it('Integer division', () => {
    console.log(suite);

    // add tests
    suite
      .add('RegExp#test', () => {
        /o/.test('Hello World!');
      })
      .add('String#indexOf', () => {
        'Hello World!'.indexOf('o') > -1;
      })
      .add('String#match', () => {
        !!'Hello World!'.match(/o/);
      })
      // add listeners
      .on('cycle', event => {
        console.log(event);
        console.log('@@@ cycle ' + String(event.target));
      })
      .on('complete', () => {
        console.log('Fastest is ' + suite.filter('fastest').map(benchmark => benchmark.name));
      })
      // run async
      .run();
  });
});
