// import EmptyFunction = jest.EmptyFunction;
// import { Suite } from 'benchmark';
//
// export function suite(name: string, fn: EmptyFunction): void {
//   describe('Integer division', () => {
//     it('Integer division', done => {
//       new Suite('Integer division')
//         .add('Math.round()', () => {
//           Math.floor(10 / 2);
//           Math.floor(11 / 3);
//           Math.floor(12 / 5);
//         })
//         .on('complete', () => {
//           console.log('Fastest is ' + this.filter('fastest').map('name'));
//           done();
//         })
//         .run({ async: true });
//     });
//   });
// }
//
// function benchmarkType(name: string, fn: string | Function, options?: Benchmark.Options): void {
//   const suite = Suite.add(this, name, fn, options);
// }
//
// suite('Integer division', () => {
//   benchmarkType('Math.round()', () => {});
//   benchmarkType('Math.round()', () => {});
// });
//
// const benchmarkClosure = () => {
//   return (name: string, fn: jest.ProvidesCallback): void => {};
// };
