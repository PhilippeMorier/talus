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
});

suite('[Coord] read', () => {
  const coord: Coord = [0, 0, 0];
  benchmark('coord[0]', () => {
    const x = coord[0];
    const y = coord[1];
    const z = coord[2];
  });

  benchmark('coord[X]', () => {
    const x = coord[X];
    const y = coord[Y];
    const z = coord[Z];
  });

  const coordObj = { x: 0, y: 0, z: 0 };
  benchmark('coordObj.x', () => {
    const x = coordObj.x;
    const y = coordObj.y;
    const z = coordObj.z;
  });
});

suite('[Coord] function parameter', () => {
  const coord: Coord = [0, 1, 2];

  function oneParameter(xyz: Coord): void {
    const x = xyz[0];
    const y = xyz[1];
    const z = xyz[2];
  }

  function deconstruct([x, y, z]: Coord): void {
    const _x = x;
    const _y = y;
    const _z = z;
  }

  benchmark('oneParameter', () => {
    oneParameter(coord);
  });

  benchmark('deconstruct', () => {
    deconstruct(coord);
  });
});
