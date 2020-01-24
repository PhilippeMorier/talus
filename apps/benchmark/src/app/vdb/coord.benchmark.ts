import { Coord, X, Y, Z } from '@talus/vdb';
import { benchmark, suite } from '../../main';

suite('[Coord] write', () => {
  let coord: Coord = [0, 0, 0];

  benchmark('coord=[1,1,1]', () => {
    coord = [1, 1, 1];
  });

  benchmark('coord[0]=1', () => {
    coord[0] = 1;
    coord[1] = 1;
    coord[2] = 1;
  });

  const coordObj = { x: 0, y: 0, z: 0 };
  benchmark('coordObj.x=1', () => {
    coordObj.x = 1;
    coordObj.y = 1;
    coordObj.z = 1;
  });
});

suite('[Coord] read', () => {
  const coord: Coord = [0, 0, 0];
  benchmark('coord[0]', () => {
    const _x = coord[0];
    const _y = coord[1];
    const _z = coord[2];
  });

  benchmark('coord[X]', () => {
    const _x = coord[X];
    const _y = coord[Y];
    const _z = coord[Z];
  });

  const coordObj = { x: 0, y: 0, z: 0 };
  benchmark('coordObj.x', () => {
    const _x = coordObj.x;
    const _y = coordObj.y;
    const _z = coordObj.z;
  });
});

suite('[Coord] function parameter', () => {
  const coord: Coord = [0, 1, 2];

  function oneParameter(xyz: Coord): void {
    const _x = xyz[0];
    const _y = xyz[1];
    const _z = xyz[2];
  }

  function deconstruct([x, y, z]: Coord): void {
    const _x = x;
    const _y = y;
    const _z = z;
  }

  benchmark('fn(xyz)', () => {
    oneParameter(coord);
  });

  benchmark('fn([x,y,z])', () => {
    deconstruct(coord);
  });
});
