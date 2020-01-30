import {
  add,
  areEqual,
  clone,
  Coord,
  CoordBBox,
  createMinCoord,
  lessThan,
  minComponent,
  offset,
  offsetBy,
} from './coord';

describe('Coord', () => {
  it('should add coordinates', () => {
    const c1: Coord = [1, 2, 3];
    const c2: Coord = [3, 2, 1];

    expect(add(c1, c2)).toEqual([4, 4, 4]);
  });

  it('should create minimal coordinate', () => {
    expect(createMinCoord()).toEqual([
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ]);
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

  it('should offset inline by 10', () => {
    const coord: Coord = [1, 2, 3];
    offset(coord, 10);

    expect(coord).toEqual([11, 12, 13]);
  });

  it.each([
    [[0, 0, 0], [1, 1, 1], true],
    [[0, 6, 6], [1, 1, 1], true],
    [[3, 3, 3], [1, 1, 1], false],
  ])('should check if less', (a: Coord, b: Coord, isLesser: boolean) => {
    expect(lessThan(a, b)).toEqual(isLesser);
  });
});

describe('CoordBBox', () => {
  describe('expand()', () => {
    it('should expand from coordinate with given dimension', () => {
      const box = new CoordBBox([3, 0, 0], [20, 5, 20]);

      box.expand([0, 1, 5], 10);

      expect(box.min).toEqual([0, 0, 0]);
      expect(box.max).toEqual([20, 10, 20]);
    });

    it('should expand bounding box to enclose point (x, y, z)', () => {
      const box = new CoordBBox([3, 0, 0], [20, 5, 20]);

      box.expand([0, 1, 5]);

      expect(box.min).toEqual([0, 0, 0]);
      expect(box.max).toEqual([20, 5, 20]);
    });

    it('should union bounding box with the given bounding box', () => {
      const box = new CoordBBox([3, 0, 0], [20, 5, 20]);
      const otherBox = new CoordBBox([2, 1, 3], [30, 10, 40]);

      box.expand(otherBox);

      expect(box.min).toEqual([2, 0, 0]);
      expect(box.max).toEqual([30, 10, 40]);
    });
  });

  it.each([
    [[3, 3, 3], [5, 5, 5], true], // complete inside
    [[-1, 0, 0], [5, 5, 5], false], // min outside
    [[0, 0, 0], [10, 10, 11], false], // max outside
    [[0, 0, 0], [9, 10, 10], true], // same min
    [[1, 0, 0], [10, 10, 10], true], // same max
    [[0, 0, 0], [10, 10, 10], true], // same box
  ])('should detect if box is inside or not', (min: Coord, max: Coord, inside: boolean) => {
    const box = new CoordBBox([0, 0, 0], [10, 10, 10]);
    const insideBox = new CoordBBox(min, max);

    expect(box.isInside(insideBox)).toEqual(inside);
  });
});
