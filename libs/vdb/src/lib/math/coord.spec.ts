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
  removeFraction,
  toKey,
} from './coord';

describe('Coord', () => {
  it('gets string representation', () => {
    const coord = { x: 1, y: 2, z: 3 };

    expect(toKey(coord)).toEqual('{"x":1,"y":2,"z":3}');
  });

  it('should add coordinates', () => {
    const c1 = { x: 1, y: 2, z: 3 };
    const c2 = { x: 3, y: 2, z: 1 };

    expect(add(c1, c2)).toEqual({ x: 4, y: 4, z: 4 });
  });

  it('should create minimal coordinate', () => {
    expect(createMinCoord()).toEqual({
      x: Number.MIN_SAFE_INTEGER,
      y: Number.MIN_SAFE_INTEGER,
      z: Number.MIN_SAFE_INTEGER,
    });
  });

  it('should consider coordinates equal', () => {
    const c1 = { x: 1, y: 2, z: 3 };
    const c2 = { x: 1, y: 2, z: 3 };

    expect(areEqual(c1, c2)).toBeTruthy();
  });

  it('should create clone', () => {
    const c1 = { x: 1, y: 2, z: 3 };

    expect(clone(c1)).toEqual(c1);
    expect(clone(c1)).not.toBe(c1);
  });

  it('should create coord with minimal components', () => {
    const c1 = { x: 10, y: 1, z: 20 };
    const c2 = { x: 0, y: 30, z: 2 };

    expect(minComponent(c1, c2)).toEqual({ x: 0, y: 1, z: 2 });
  });

  it('should offset by 10', () => {
    const coord = { x: 1, y: 2, z: 3 };

    expect(offsetBy(coord, 10)).toEqual({ x: 11, y: 12, z: 13 });
  });

  it('should offset inline by 10', () => {
    const coord = { x: 1, y: 2, z: 3 };
    offset(coord, 10);

    expect(coord).toEqual({ x: 11, y: 12, z: 13 });
  });

  it('should remove fraction', () => {
    const coord = { x: -0, y: +0, z: +55.9735458326445 };
    removeFraction(coord);

    expect(coord).toEqual({ x: 0, y: 0, z: 55 });
  });

  it.each([
    [{ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, true],
    [{ x: 0, y: 6, z: 6 }, { x: 1, y: 1, z: 1 }, true],
    [{ x: 3, y: 3, z: 3 }, { x: 1, y: 1, z: 1 }, false],
  ])('should check if less', (a: Coord, b: Coord, isLesser: boolean) => {
    expect(lessThan(a, b)).toEqual(isLesser);
  });
});

describe('CoordBBox', () => {
  describe('expand()', () => {
    it('should expand from coordinate with given dimension', () => {
      const box = new CoordBBox({ x: 3, y: 0, z: 0 }, { x: 20, y: 5, z: 20 });

      box.expand({ x: 0, y: 1, z: 5 }, 10);

      expect(box.min).toEqual({ x: 0, y: 0, z: 0 });
      expect(box.max).toEqual({ x: 20, y: 10, z: 20 });
    });

    it('should expand bounding box to enclose point (x, y, z)', () => {
      const box = new CoordBBox({ x: 3, y: 0, z: 0 }, { x: 20, y: 5, z: 20 });

      box.expand({ x: 0, y: 1, z: 5 });

      expect(box.min).toEqual({ x: 0, y: 0, z: 0 });
      expect(box.max).toEqual({ x: 20, y: 5, z: 20 });
    });

    it('should union bounding box with the given bounding box', () => {
      const box = new CoordBBox({ x: 3, y: 0, z: 0 }, { x: 20, y: 5, z: 20 });
      const otherBox = new CoordBBox({ x: 2, y: 1, z: 3 }, { x: 30, y: 10, z: 40 });

      box.expand(otherBox);

      expect(box.min).toEqual({ x: 2, y: 0, z: 0 });
      expect(box.max).toEqual({ x: 30, y: 10, z: 40 });
    });
  });

  it.each([
    [{ x: 3, y: 3, z: 3 }, { x: 5, y: 5, z: 5 }, true], // complete inside
    [{ x: -1, y: 0, z: 0 }, { x: 5, y: 5, z: 5 }, false], // min outside
    [{ x: 0, y: 0, z: 0 }, { x: 10, y: 10, z: 11 }, false], // max outside
    [{ x: 0, y: 0, z: 0 }, { x: 9, y: 10, z: 10 }, true], // same min
    [{ x: 1, y: 0, z: 0 }, { x: 10, y: 10, z: 10 }, true], // same max
    [{ x: 0, y: 0, z: 0 }, { x: 10, y: 10, z: 10 }, true], // same box
  ])('should detect if box is inside or not', (min: Coord, max: Coord, inside: boolean) => {
    const box = new CoordBBox({ x: 0, y: 0, z: 0 }, { x: 10, y: 10, z: 10 });
    const insideBox = new CoordBBox(min, max);

    expect(box.isInside(insideBox)).toEqual(inside);
  });
});
