import { Coord } from '../math/coord';
import { InternalNode1, InternalNode2 } from './internal-node';
import { LeafNode } from './leaf-node';

describe('InternalNode1', () => {
  describe('static config values', () => {
    expect(InternalNode1.LOG2DIM).toEqual(2);
    expect(InternalNode1.TOTAL).toEqual(5);
    expect(InternalNode1.DIM).toEqual(32);
    expect(InternalNode1.NUM_VALUES).toEqual(64);
    expect(InternalNode1.LEVEL).toEqual(1);
    expect(InternalNode1.NUM_VOXELS).toEqual(32_768);
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
      [[0, 0, LeafNode.DIM], 1],
      [[0, LeafNode.DIM, LeafNode.DIM], 4 + 1],
      [[LeafNode.DIM, LeafNode.DIM, LeafNode.DIM], 16 + 4 + 1],

      [[0, 0, LeafNode.DIM * 0], 0],
      [[0, 0, LeafNode.DIM * 1], 1],
      [[0, 0, LeafNode.DIM * 2], 2],
      [[0, 0, LeafNode.DIM * 3], 3],

      [[0, LeafNode.DIM * 0, 0], 0 * 4],
      [[0, LeafNode.DIM * 1, 0], 1 * 4],
      [[0, LeafNode.DIM * 2, 0], 2 * 4],
      [[0, LeafNode.DIM * 3, 0], 3 * 4],

      [[LeafNode.DIM * 0, 0, 0], 0 * 16],
      [[LeafNode.DIM * 1, 0, 0], 1 * 16],
      [[LeafNode.DIM * 2, 0, 0], 2 * 16],
      [[LeafNode.DIM * 3, 0, 0], 3 * 16],

      // 24 / 8 = 3 -> 3 x 16 = 48  ╮
      // 9  / 8 = 1 -> 1 x 4  = 4   ├─> 48 + 4 + 2 = 54
      // 17 / 8 = 2 -> 2 x 1  = 2   ╯
      [[24, 9, 17], 54],
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

  describe('onVoxelCount()', () => {
    it('should count all activated voxels', () => {
      const leaf = new InternalNode1<number>([0, 0, 0]);

      let onCounter = 0;
      for (let x = 0; x < InternalNode1.DIM; x++) {
        for (let y = 0; y < InternalNode1.DIM; y++) {
          for (let z = 0; z < InternalNode1.DIM; z++) {
            leaf.setValueOn([x, y, z], 42);
            onCounter++;

            expect(leaf.onVoxelCount()).toEqual(onCounter);
          }
        }
      }

      expect(onCounter).toEqual(Math.pow(InternalNode1.DIM, 3));
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

  const generateRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const generateRandomCoord = (min, max): Coord => [
    generateRandomInRange(min, max),
    generateRandomInRange(min, max),
    generateRandomInRange(min, max),
  ];
  const generateRandomCoords = (length, min, max) => {
    return Array.from({ length }, () => [generateRandomCoord(min, max)]);
  };

  it.each(generateRandomCoords(100, 0, 4095))(
    'should set/get random value at %j ',
    (xyz: Coord) => {
      const child = new InternalNode2<boolean>([0, 0, 0]);

      child.setValueOn(xyz, true);

      expect(child.isValueOn(xyz)).toBeTruthy();
    },
  );

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
