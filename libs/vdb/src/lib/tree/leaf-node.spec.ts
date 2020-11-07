import { LeafNode } from './leaf-node';

describe('LeafNode', () => {
  describe('static config values', () => {
    expect(LeafNode.LOG2DIM).toEqual(3);
    expect(LeafNode.TOTAL).toEqual(3);
    expect(LeafNode.DIM).toEqual(8);
    expect(LeafNode.NUM_VALUES).toEqual(512);
    expect(LeafNode.LEVEL).toEqual(0);
    expect(LeafNode.NUM_VOXELS).toEqual(512);
  });

  describe('coordToOffset()', () => {
    it('should calculate the offset', () => {
      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 0 })).toEqual(0);
      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 8 })).toEqual(0);

      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 1 })).toEqual(1);
      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 2 })).toEqual(2);
      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 3 })).toEqual(3);
      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 4 })).toEqual(4);
      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 5 })).toEqual(5);
      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 6 })).toEqual(6);
      expect(LeafNode.coordToOffset({ x: 0, y: 0, z: 7 })).toEqual(7);

      expect(LeafNode.coordToOffset({ x: 0, y: 1, z: 0 })).toEqual(8);
      expect(LeafNode.coordToOffset({ x: 0, y: 1, z: 1 })).toEqual(9);
      expect(LeafNode.coordToOffset({ x: 0, y: 1, z: 2 })).toEqual(10);
      expect(LeafNode.coordToOffset({ x: 0, y: 1, z: 3 })).toEqual(11);
      expect(LeafNode.coordToOffset({ x: 0, y: 1, z: 4 })).toEqual(12);
      expect(LeafNode.coordToOffset({ x: 0, y: 1, z: 5 })).toEqual(13);
      expect(LeafNode.coordToOffset({ x: 0, y: 1, z: 6 })).toEqual(14);
      expect(LeafNode.coordToOffset({ x: 0, y: 1, z: 7 })).toEqual(15);

      expect(LeafNode.coordToOffset({ x: 1, y: 0, z: 0 })).toEqual(64);
      expect(LeafNode.coordToOffset({ x: 1, y: 0, z: 1 })).toEqual(65);
      expect(LeafNode.coordToOffset({ x: 1, y: 0, z: 2 })).toEqual(66);
      expect(LeafNode.coordToOffset({ x: 1, y: 0, z: 3 })).toEqual(67);
      expect(LeafNode.coordToOffset({ x: 1, y: 0, z: 4 })).toEqual(68);
      expect(LeafNode.coordToOffset({ x: 1, y: 0, z: 5 })).toEqual(69);
      expect(LeafNode.coordToOffset({ x: 1, y: 0, z: 6 })).toEqual(70);
      expect(LeafNode.coordToOffset({ x: 1, y: 0, z: 7 })).toEqual(71);
    });
  });

  describe('[set|get]ValueOn()', () => {
    it('should set/get value on at given coordinate', () => {
      const leaf = new LeafNode<number>({ x: 0, y: 0, z: 0 });

      leaf.setValueOn({ x: 0, y: 0, z: 0 }, 42);
      leaf.setValueOn({ x: 0, y: 1, z: 0 }, 43);
      leaf.setValueOn({ x: 1, y: 0, z: 0 }, 44);

      expect(leaf.getValue({ x: 0, y: 0, z: 0 })).toEqual(42);
      expect(leaf.getValue({ x: 0, y: 1, z: 0 })).toEqual(43);
      expect(leaf.getValue({ x: 1, y: 0, z: 0 })).toEqual(44);

      expect(leaf.getValue({ x: 1, y: 1, z: 1 })).toBeUndefined();
    });
  });

  describe('onVoxelCount()', () => {
    it('should count all activated voxels', () => {
      const leaf = new LeafNode<number>({ x: 0, y: 0, z: 0 });

      let onCounter = 0;
      for (let x = 0; x < LeafNode.DIM; x++) {
        for (let y = 0; y < LeafNode.DIM; y++) {
          for (let z = 0; z < LeafNode.DIM; z++) {
            leaf.setValueOn({ x, y, z }, 42);
            onCounter++;

            expect(leaf.onVoxelCount()).toEqual(onCounter);
          }
        }
      }

      expect(onCounter).toEqual(Math.pow(LeafNode.DIM, 3));
    });
  });

  describe('beginVoxelOn()', () => {
    it('should iterate over all activated voxels', () => {
      const leaf = new LeafNode<number>({ x: 0, y: 0, z: 0 });
      const expectedValues = [0, 1, 2, 3];
      leaf.setValueOn({ x: 0, y: 0, z: 0 }, expectedValues[0]);
      leaf.setValueOn({ x: 0, y: 0, z: 1 }, expectedValues[1]);
      leaf.setValueOn({ x: 0, y: 2, z: 0 }, expectedValues[2]);
      leaf.setValueOn({ x: 3, y: 0, z: 0 }, expectedValues[3]);

      let counter = 0;
      for (const voxel of leaf.beginVoxelOn()) {
        expect(voxel.value).toEqual(expectedValues[counter]);
        counter++;
      }

      expect(counter).toEqual(expectedValues.length);
    });
  });

  describe('offsetToLocalCoord()', () => {
    it('should calculate local coordinate from offset', () => {
      const dim = LeafNode.DIM;
      const dimSquare = LeafNode.DIM * LeafNode.DIM;

      expect(LeafNode.offsetToLocalCoord(0)).toEqual({ x: 0, y: 0, z: 0 });
      expect(LeafNode.offsetToLocalCoord(1)).toEqual({ x: 0, y: 0, z: 1 });
      expect(LeafNode.offsetToLocalCoord(2)).toEqual({ x: 0, y: 0, z: 2 });
      expect(LeafNode.offsetToLocalCoord(3)).toEqual({ x: 0, y: 0, z: 3 });
      expect(LeafNode.offsetToLocalCoord(4)).toEqual({ x: 0, y: 0, z: 4 });
      expect(LeafNode.offsetToLocalCoord(5)).toEqual({ x: 0, y: 0, z: 5 });
      expect(LeafNode.offsetToLocalCoord(6)).toEqual({ x: 0, y: 0, z: 6 });
      expect(LeafNode.offsetToLocalCoord(7)).toEqual({ x: 0, y: 0, z: 7 });

      expect(LeafNode.offsetToLocalCoord(0 * dim + 0)).toEqual({ x: 0, y: 0, z: 0 });
      expect(LeafNode.offsetToLocalCoord(1 * dim + 1)).toEqual({ x: 0, y: 1, z: 1 });
      expect(LeafNode.offsetToLocalCoord(2 * dim + 2)).toEqual({ x: 0, y: 2, z: 2 });
      expect(LeafNode.offsetToLocalCoord(3 * dim + 3)).toEqual({ x: 0, y: 3, z: 3 });
      expect(LeafNode.offsetToLocalCoord(4 * dim + 4)).toEqual({ x: 0, y: 4, z: 4 });
      expect(LeafNode.offsetToLocalCoord(5 * dim + 5)).toEqual({ x: 0, y: 5, z: 5 });
      expect(LeafNode.offsetToLocalCoord(6 * dim + 6)).toEqual({ x: 0, y: 6, z: 6 });
      expect(LeafNode.offsetToLocalCoord(7 * dim + 7)).toEqual({ x: 0, y: 7, z: 7 });

      expect(LeafNode.offsetToLocalCoord(0 * dimSquare + 0)).toEqual({ x: 0, y: 0, z: 0 });
      expect(LeafNode.offsetToLocalCoord(1 * dimSquare + 1)).toEqual({ x: 1, y: 0, z: 1 });
      expect(LeafNode.offsetToLocalCoord(2 * dimSquare + 2)).toEqual({ x: 2, y: 0, z: 2 });
      expect(LeafNode.offsetToLocalCoord(3 * dimSquare + 3)).toEqual({ x: 3, y: 0, z: 3 });
      expect(LeafNode.offsetToLocalCoord(4 * dimSquare + 4)).toEqual({ x: 4, y: 0, z: 4 });
      expect(LeafNode.offsetToLocalCoord(5 * dimSquare + 5)).toEqual({ x: 5, y: 0, z: 5 });
      expect(LeafNode.offsetToLocalCoord(6 * dimSquare + 6)).toEqual({ x: 6, y: 0, z: 6 });
      expect(LeafNode.offsetToLocalCoord(7 * dimSquare + 7)).toEqual({ x: 7, y: 0, z: 7 });

      expect(LeafNode.offsetToLocalCoord(0 * dimSquare + 0 * dim + 0)).toEqual({
        x: 0,
        y: 0,
        z: 0,
      });
      expect(LeafNode.offsetToLocalCoord(1 * dimSquare + 1 * dim + 1)).toEqual({
        x: 1,
        y: 1,
        z: 1,
      });
      expect(LeafNode.offsetToLocalCoord(2 * dimSquare + 2 * dim + 2)).toEqual({
        x: 2,
        y: 2,
        z: 2,
      });
      expect(LeafNode.offsetToLocalCoord(3 * dimSquare + 3 * dim + 3)).toEqual({
        x: 3,
        y: 3,
        z: 3,
      });
      expect(LeafNode.offsetToLocalCoord(4 * dimSquare + 4 * dim + 4)).toEqual({
        x: 4,
        y: 4,
        z: 4,
      });
      expect(LeafNode.offsetToLocalCoord(5 * dimSquare + 5 * dim + 5)).toEqual({
        x: 5,
        y: 5,
        z: 5,
      });
      expect(LeafNode.offsetToLocalCoord(6 * dimSquare + 6 * dim + 6)).toEqual({
        x: 6,
        y: 6,
        z: 6,
      });
      expect(LeafNode.offsetToLocalCoord(7 * dimSquare + 7 * dim + 7)).toEqual({
        x: 7,
        y: 7,
        z: 7,
      });
    });
  });

  describe('offsetToGlobalCoord()', () => {
    it('should calculate global coordinate from offset', () => {
      const dim = LeafNode.DIM;
      const dimSquare = LeafNode.DIM * LeafNode.DIM;

      const leaf = new LeafNode<number>({ x: dim, y: dim, z: dim });

      expect(leaf.offsetToGlobalCoord(0)).toEqual({ x: dim, y: dim, z: dim });
      expect(leaf.offsetToGlobalCoord(1)).toEqual({ x: dim, y: dim, z: dim + 1 });
      expect(leaf.offsetToGlobalCoord(1 * dimSquare + 1)).toEqual({
        x: dim + 1,
        y: dim,
        z: dim + 1,
      });
      expect(leaf.offsetToGlobalCoord(1 * dimSquare + 1 * dim + 1)).toEqual({
        x: dim + 1,
        y: dim + 1,
        z: dim + 1,
      });
    });
  });
});
