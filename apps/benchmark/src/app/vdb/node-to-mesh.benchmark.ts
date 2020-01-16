import { benchmark, suite } from '../../main';

suite('[NodeToMesh] array.push()', () => {
  benchmark('multiple small push', () => {
    const positions: number[] = [];

    positions.push(1);
    positions.push(2);
    positions.push(3);
    positions.push(4);
    positions.push(5);
    positions.push(6);
    positions.push(7);
    positions.push(8);
    positions.push(9);
    positions.push(10);
    positions.push(11);
    positions.push(12);
    positions.push(13);
    positions.push(14);
    positions.push(15);
    positions.push(16);
    positions.push(17);
    positions.push(18);
    positions.push(19);
    positions.push(20);
  });

  benchmark('single big push', () => {
    const positions: number[] = [];

    positions.push(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
  });
});
