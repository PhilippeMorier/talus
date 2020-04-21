import { random, randomInRange, setNumberGeneratorSeed } from './random';

describe('Random', () => {
  it('should generate random numbers based on default seed', () => {
    expect(random()).toEqual(0.7554669303353876);
    expect(random()).toEqual(0.14118697051890194);
    expect(random()).toEqual(0.4612848109100014);
    expect(random()).toEqual(0.09477006876841187);

    expect(randomInRange(-1, 0)).toEqual(-0.8258029038552195);
    expect(randomInRange(-10, -5)).toEqual(-8.496621289523318);
    expect(randomInRange(1, 2)).toEqual(1.772093336796388);
    expect(randomInRange(3000, 4000)).toEqual(3440.0293251965195);
  });

  it('should generate random numbers based on custom seed', () => {
    setNumberGeneratorSeed('testSeed');

    expect(random()).toEqual(0.6172510553151369);
    expect(random()).toEqual(0.31603568652644753);
    expect(random()).toEqual(0.3142450200393796);
    expect(random()).toEqual(0.38017958914861083);

    expect(randomInRange(-1, 0)).toEqual(-0.4323689080774784);
    expect(randomInRange(-10, -5)).toEqual(-9.301879717968404);
    expect(randomInRange(1, 2)).toEqual(1.4558202477637678);
    expect(randomInRange(3000, 4000)).toEqual(3329.66287760064);
  });

  it('should generate only random numbers within range', () => {
    for (let i = 0; i < 1000; i++) {
      const randomNumber = randomInRange(-10, 200);

      expect(randomNumber).toBeGreaterThanOrEqual(-10);
      expect(randomNumber).toBeLessThanOrEqual(200);
    }
  });

  it('should generate only random numbers within default range of [0, 1]', () => {
    for (let i = 0; i < 1000; i++) {
      expect(random()).toBeGreaterThanOrEqual(0);
      expect(random()).toBeLessThanOrEqual(1);
    }
  });
});
