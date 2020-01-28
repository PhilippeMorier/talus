import {
  add,
  areEqual,
  clone,
  Coord,
  CoordBBox,
  createMinCoord,
  minComponent,
  offsetBy,
} from './coord';

describe('Coord', () => {
  it('should add coordinates', () => {
    const c1: Coord = [1, 2, 3];
    const c2: Coord = [3, 2, 1];

    expect(add(c1, c2)).toEqual([4, 4, 4]);
  });

  it('should create minimal coordinate', () => {
    expect(createMinCoord()).toEqual([5e-324, 5e-324, 5e-324]);
  });

  it('should consider coordinates equal', () => {
    const c1: Coord = [1, 2, 3];
    const c2: Coord = [1, 2, 3];

    expect(areEqual(c1, c2)).toBeTruthy();
  });

  it('should create clone', () => {
    const c1: Coord = [1, 2, 3];

    expect(clone(c1)).toEqual(c1);
    expect(clone(c1)).not.toBe(c1);
  });

  it('should create coord with minimal components', () => {
    const c1: Coord = [10, 1, 20];
    const c2: Coord = [0, 30, 2];

    expect(minComponent(c1, c2)).toEqual([0, 1, 2]);
  });

  it('should offset by 10', () => {
    const coord: Coord = [1, 2, 3];

    expect(offsetBy(coord, 10)).toEqual([11, 12, 13]);
  });
});

describe('CoordBBox', () => {
  it('should expand', () => {
    const box = new CoordBBox([3, 0, 0], [20, 5, 20]);

    box.expand([0, 1, 5], 10);

    expect(box.min).toEqual([0, 0, 0]);
    expect(box.max).toEqual([20, 10, 20]);
  });
});
