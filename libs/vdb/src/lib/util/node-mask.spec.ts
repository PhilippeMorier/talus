import { NodeMask } from './node-mask';

describe('NodeMask', () => {
  describe('setOn()', () => {
    it.each([
      [0, true],
      [16, true],
      [32, true],
      [48, true],
      [63, true],
      [64, false],
    ])('should set bit on at index (%j)', (index: number, isOn: boolean) => {
      const mask = new NodeMask(64);

      mask.setOn(index);

      expect(mask.isOn(index)).toEqual(isOn);
      expect(mask.isOff(index)).toEqual(!isOn);
    });

    it('should ignore given index out of bounds', () => {
      const mask = new NodeMask(16);

      // Still works since `BitSet` uses `Uint32Array` under the hood
      mask.setOn(31);
      expect(mask.isOn(31)).toEqual(true);
      expect(mask.isOff(31)).toEqual(false);

      // Doesn't work anymore because only one Uint32 is used
      mask.setOn(32);
      expect(mask.isOn(32)).toEqual(false);
      expect(mask.isOff(32)).toEqual(true);
    });
  });

  describe('setOff()', () => {
    it.each([
      [1, false],
      [17, false],
      [33, false],
      [49, false],
      [62, false],
      [64, false],
    ])('should set bit off at index (%j)', (index: number, isOn: boolean) => {
      const mask = new NodeMask(64, true);

      mask.setOff(index);

      expect(mask.isOn(index)).toEqual(isOn);
      expect(mask.isOff(index)).toEqual(!isOn);
    });
  });

  describe('constructor()', () => {
    it('should initialize all bits as off', () => {
      const mask = new NodeMask(48);

      for (let i = 0; i < 48; i++) {
        expect(mask.isOn(i)).toBeFalsy();
      }
    });

    it('should activate all bits', () => {
      const mask = new NodeMask(32, true);

      for (let i = 0; i < 32; i++) {
        expect(mask.isOn(i)).toBeTruthy();
      }

      expect(mask.countOn()).toEqual(32);
    });
  });

  it('should iterate over all activated bits', () => {
    const mask = new NodeMask(32);
    const expectedSetIndices = [6, 16, 31];

    expectedSetIndices.forEach(index => mask.setOn(index));

    let counter = 0;
    for (const index of mask.beginOn()) {
      expect(index).toEqual(expectedSetIndices[counter]);
      counter++;
    }

    expect(counter).toEqual(3);
  });
});
