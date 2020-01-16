import { add, areEqual, clone, Coord, createMinCoord } from './coord';

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
});
