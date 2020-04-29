import { radiusAtOffset, Stem } from './stem';

describe('Stem', () => {
  it('should calculate radius at offset', () => {
    const stem = new Stem(4);
    stem.length = 3;
    stem.radius = 7;
    const z1 = 5;

    expect(radiusAtOffset(stem, z1, 0.5, 0.6)).toEqual(-10.5);
    expect(radiusAtOffset(stem, z1, 1.5, 0.6)).toEqual(10.392304845413264);
    expect(radiusAtOffset(stem, z1, -1, 0.6)).toEqual(42);
    expect(radiusAtOffset(stem, z1, -2, 0.6)).toEqual(77);
    expect(radiusAtOffset(stem, z1, 2, 0.6)).toEqual(4.898979485566356);
  });
});
