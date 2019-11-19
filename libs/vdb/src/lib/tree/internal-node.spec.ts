import { Coord } from '../math/coord';
import { InternalNode1, InternalNode2 } from './internal-node';

describe('InternalNode1', () => {
  describe('static config values', () => {
    expect(InternalNode1.LOG2DIM).toEqual(4);
    expect(InternalNode1.TOTAL).toEqual(7);
    expect(InternalNode1.DIM).toEqual(128);
    expect(InternalNode1.NUM_VALUES).toEqual(4096);
    expect(InternalNode1.LEVEL).toEqual(1);
    expect(InternalNode1.NUM_VOXELS).toEqual(2_097_152);
  });

  describe('setValueOn()', () => {
    it.each([
      [[0, 0, 0], true],
      [[0, 0, 0], false],
      [[0, 0, 1], true],
      [[0, 0, 1], false],
      [[0, 1, 0], true],
      [[0, 1, 0], false],
      [[1, 0, 0], true],
      [[1, 0, 0], false],
      [[0, 0, 127], true],
      [[0, 0, 127], false],
      [[0, 127, 0], true],
      [[0, 127, 0], false],
      [[127, 0, 0], true],
      [[127, 0, 0], false],
    ])(
      '%#. should set and activate at the given index %j the value (%j)',
      (xyz: Coord, value: boolean) => {
        const child = new InternalNode1<boolean>([0, 0, 0]);

        child.setValueOn(xyz, value);

        expect(child.getValue(xyz)).toEqual(value);
      },
    );

    it('should get `undefined` on an unset index', () => {
      const child = new InternalNode1<boolean>([0, 0, 0]);

      expect(child.getValue([0, 0, 0])).toBeUndefined();
    });
  });

  describe('coordToOffset()', () => {
    it.each([
      [[0, 0, 128], 0],
      [[0, 0, 127], 15],

      [[0, 0, 0], 0],
      [[0, 0, 1], 0],
      [[0, 1, 0], 0],
      [[1, 0, 0], 0],
      [[1, 1, 1], 0],

      [[0, 0, 127], 15],
      [[0, 127, 127], 255],
      [[127, 127, 127], 4095],

      [[0, 0, 8], 1],
      [[0, 0, 16], 2],
      [[0, 0, 24], 3],
      [[0, 0, 112], 14],
      [[0, 0, 120], 15],

      [[0, 8, 0], 16],
      [[0, 16, 0], 32],
      [[0, 24, 0], 48],
      [[0, 112, 0], 224],
      [[0, 120, 0], 240],

      [[8, 0, 0], 256],
      [[16, 0, 0], 512],
      [[24, 0, 0], 768],
      [[112, 0, 0], 3584],
      [[120, 0, 0], 3840],

      [[0, 8, 0], 16],
      [[0, 8, 8], 17],
      [[0, 8, 16], 18],
      [[0, 8, 24], 19],
      [[0, 8, 112], 30],
      [[0, 8, 120], 31],

      [[8, 0, 0], 256],
      [[8, 0, 8], 257],
      [[8, 0, 16], 258],
      [[8, 0, 24], 259],
      [[8, 0, 112], 270],
      [[8, 0, 120], 271],

      // 57  / 8 = 7  -> 7  x 256 = 1792  ╮
      // 19  / 8 = 2  -> 2  x 16  = 32    ├─> 1792 + 32 + 13 = 1837
      // 104 / 8 = 13 -> 13 x 1   = 13    ╯
      [[57, 19, 104], 1837],
    ])('should return for coordinate %j the offset (%j)', (xyz: Coord, offset: number) => {
      const child = new InternalNode1<number>([0, 0, 0]);

      expect(child.coordToOffset(xyz)).toEqual(offset);
    });
  });

  describe('isValueOn()', () => {
    it('should set value on', () => {
      const child = new InternalNode1<boolean>([0, 0, 0]);

      child.setValueOn([0, 0, 0], true);

      expect(child.isValueOn([0, 0, 0])).toBeTruthy();
      expect(child.isValueOn([0, 0, 1])).toBeFalsy();
      expect(child.isValueOn([0, 0, 8])).toBeFalsy();
    });
  });
});

describe('InternalNode2', () => {
  describe('static config values', () => {
    expect(InternalNode2.LOG2DIM).toEqual(5);
    expect(InternalNode2.TOTAL).toEqual(12);
    expect(InternalNode2.DIM).toEqual(4096);
    expect(InternalNode2.NUM_VALUES).toEqual(32768);
    expect(InternalNode2.LEVEL).toEqual(2);
    expect(InternalNode2.NUM_VOXELS).toEqual(68_719_476_736);
  });

  it('should create two levels of internal nodes', () => {
    const child = new InternalNode2<boolean>([0, 0, 0]);

    child.setValueOn([0, 0, 0], true);

    expect(child.isValueOn([0, 0, 0])).toBeTruthy();
    expect(child.isValueOn([0, 0, 1])).toBeFalsy();
    expect(child.isValueOn([0, 0, 8])).toBeFalsy();
    expect(child.isValueOn([0, 0, 8])).toBeFalsy();
  });

  describe('coordToOffset()', () => {
    it.each([
      [[0, 0, 0], 0],
      [[0, 0, 4096], 0],
      [[0, 0, 128], 1],
      [[0, 0, 256], 2],
      [[0, 0, 384], 3],
      [[0, 0, 512], 4],
      [[0, 0, 4095], 31],
    ])('should return for coordinate %j the offset (%j)', (xyz: Coord, offset: number) => {
      const child = new InternalNode2<number>([0, 0, 0]);

      expect(child.coordToOffset(xyz)).toEqual(offset);
    });
  });
});
