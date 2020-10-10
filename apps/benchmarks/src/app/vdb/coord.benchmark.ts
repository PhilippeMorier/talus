import { Coord } from '@talus/vdb';
import { benchmark, suite } from '../../main';

suite('[Coord] create', () => {
  benchmark('array=[1,1,1]', () => {
    const _array = [1, 1, 1];
  });

  benchmark('coord=new Coord(1,1,1)', () => {
    const _coord = new Coord(1, 1, 1);
  });

  benchmark('coord={x:1,y:1,z:1}', () => {
    const _coord: Coord = { x: 1, y: 1, z: 1 };
  });
});

suite('[Coord] write', () => {
  const arr = [0, 0, 0];
  benchmark('arr[0] = 1', () => {
    arr[0] = 1;
    arr[1] = 1;
    arr[2] = 1;
  });

  const coord = new Coord(0, 0, 0);
  benchmark('coord.x=1', () => {
    coord.x = 1;
    coord.y = 1;
    coord.z = 1;
  });
});

suite('[Coord] read', () => {
  const array = [0, 0, 0];
  benchmark('array[0]', () => {
    const _x = array[0];
    const _y = array[1];
    const _z = array[2];
  });

  const coord: Coord = new Coord(0, 0, 0);
  benchmark('coord.x', () => {
    const _x = coord.x;
    const _y = coord.y;
    const _z = coord.z;
  });
});

suite('[Coord] function parameter', () => {
  const coord: Coord = new Coord(0, 1, 2);

  function oneParameter(xyz: Coord): void {
    const _x = xyz.x;
    const _y = xyz.y;
    const _z = xyz.z;
  }

  function deconstruct({ x, y, z }: Coord): void {
    const _x = x;
    const _y = y;
    const _z = z;
  }

  function individualParameter(x: number, y: number, z: number): void {
    const _x = x;
    const _y = y;
    const _z = z;
  }

  benchmark('fn(xyz)', () => {
    oneParameter(coord);
  });

  benchmark('fn({x,y,z})', () => {
    deconstruct(coord);
  });

  benchmark('fn(x,y,z)', () => {
    individualParameter(coord.x, coord.y, coord.z);
  });
});
