import { LeafNode } from './leaf-node';
import { Coord } from '@talus/vdb';

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
      expect(LeafNode.coordToOffset(new Coord(0, 0, 0))).toEqual(0);
      expect(LeafNode.coordToOffset(new Coord(0, 0, 8))).toEqual(0);

      expect(LeafNode.coordToOffset(new Coord(0, 0, 1))).toEqual(1);
      expect(LeafNode.coordToOffset(new Coord(0, 0, 2))).toEqual(2);
      expect(LeafNode.coordToOffset(new Coord(0, 0, 3))).toEqual(3);
      expect(LeafNode.coordToOffset(new Coord(0, 0, 4))).toEqual(4);
      expect(LeafNode.coordToOffset(new Coord(0, 0, 5))).toEqual(5);
      expect(LeafNode.coordToOffset(new Coord(0, 0, 6))).toEqual(6);
      expect(LeafNode.coordToOffset(new Coord(0, 0, 7))).toEqual(7);

      expect(LeafNode.coordToOffset(new Coord(0, 1, 0))).toEqual(8);
      expect(LeafNode.coordToOffset(new Coord(0, 1, 1))).toEqual(9);
      expect(LeafNode.coordToOffset(new Coord(0, 1, 2))).toEqual(10);
      expect(LeafNode.coordToOffset(new Coord(0, 1, 3))).toEqual(11);
      expect(LeafNode.coordToOffset(new Coord(0, 1, 4))).toEqual(12);
      expect(LeafNode.coordToOffset(new Coord(0, 1, 5))).toEqual(13);
      expect(LeafNode.coordToOffset(new Coord(0, 1, 6))).toEqual(14);
      expect(LeafNode.coordToOffset(new Coord(0, 1, 7))).toEqual(15);

      expect(LeafNode.coordToOffset(new Coord(1, 0, 0))).toEqual(64);
      expect(LeafNode.coordToOffset(new Coord(1, 0, 1))).toEqual(65);
      expect(LeafNode.coordToOffset(new Coord(1, 0, 2))).toEqual(66);
      expect(LeafNode.coordToOffset(new Coord(1, 0, 3))).toEqual(67);
      expect(LeafNode.coordToOffset(new Coord(1, 0, 4))).toEqual(68);
      expect(LeafNode.coordToOffset(new Coord(1, 0, 5))).toEqual(69);
      expect(LeafNode.coordToOffset(new Coord(1, 0, 6))).toEqual(70);
      expect(LeafNode.coordToOffset(new Coord(1, 0, 7))).toEqual(71);
    });
  });

  describe('[set|get]ValueOn()', () => {
    it('should set/get value on at given coordinate', () => {
      const leaf = new LeafNode<number>(new Coord(0, 0, 0));

      leaf.setValueOn(new Coord(0, 0, 0), 42);
      leaf.setValueOn(new Coord(0, 1, 0), 43);
      leaf.setValueOn(new Coord(1, 0, 0), 44);

      expect(leaf.getValue(new Coord(0, 0, 0))).toEqual(42);
      expect(leaf.getValue(new Coord(0, 1, 0))).toEqual(43);
      expect(leaf.getValue(new Coord(1, 0, 0))).toEqual(44);

      expect(leaf.getValue(new Coord(1, 1, 1))).toBeUndefined();
    });
  });

  describe('onVoxelCount()', () => {
    it('should count all activated voxels', () => {
      const leaf = new LeafNode<number>(new Coord(0, 0, 0));

      let onCounter = 0;
      for (let x = 0; x < LeafNode.DIM; x++) {
        for (let y = 0; y < LeafNode.DIM; y++) {
          for (let z = 0; z < LeafNode.DIM; z++) {
            leaf.setValueOn(new Coord(x, y, z), 42);
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
      const leaf = new LeafNode<number>(new Coord(0, 0, 0));
      const expectedValues = [0, 1, 2, 3];
      leaf.setValueOn(new Coord(0, 0, 0), expectedValues[0]);
      leaf.setValueOn(new Coord(0, 0, 1), expectedValues[1]);
      leaf.setValueOn(new Coord(0, 2, 0), expectedValues[2]);
      leaf.setValueOn(new Coord(3, 0, 0), expectedValues[3]);

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

      expect(LeafNode.offsetToLocalCoord(0)).toEqual(new Coord(0, 0, 0));
      expect(LeafNode.offsetToLocalCoord(1)).toEqual(new Coord(0, 0, 1));
      expect(LeafNode.offsetToLocalCoord(2)).toEqual(new Coord(0, 0, 2));
      expect(LeafNode.offsetToLocalCoord(3)).toEqual(new Coord(0, 0, 3));
      expect(LeafNode.offsetToLocalCoord(4)).toEqual(new Coord(0, 0, 4));
      expect(LeafNode.offsetToLocalCoord(5)).toEqual(new Coord(0, 0, 5));
      expect(LeafNode.offsetToLocalCoord(6)).toEqual(new Coord(0, 0, 6));
      expect(LeafNode.offsetToLocalCoord(7)).toEqual(new Coord(0, 0, 7));

      expect(LeafNode.offsetToLocalCoord(0 * dim + 0)).toEqual(new Coord(0, 0, 0));
      expect(LeafNode.offsetToLocalCoord(1 * dim + 1)).toEqual(new Coord(0, 1, 1));
      expect(LeafNode.offsetToLocalCoord(2 * dim + 2)).toEqual(new Coord(0, 2, 2));
      expect(LeafNode.offsetToLocalCoord(3 * dim + 3)).toEqual(new Coord(0, 3, 3));
      expect(LeafNode.offsetToLocalCoord(4 * dim + 4)).toEqual(new Coord(0, 4, 4));
      expect(LeafNode.offsetToLocalCoord(5 * dim + 5)).toEqual(new Coord(0, 5, 5));
      expect(LeafNode.offsetToLocalCoord(6 * dim + 6)).toEqual(new Coord(0, 6, 6));
      expect(LeafNode.offsetToLocalCoord(7 * dim + 7)).toEqual(new Coord(0, 7, 7));

      expect(LeafNode.offsetToLocalCoord(0 * dimSquare + 0)).toEqual(new Coord(0, 0, 0));
      expect(LeafNode.offsetToLocalCoord(1 * dimSquare + 1)).toEqual(new Coord(1, 0, 1));
      expect(LeafNode.offsetToLocalCoord(2 * dimSquare + 2)).toEqual(new Coord(2, 0, 2));
      expect(LeafNode.offsetToLocalCoord(3 * dimSquare + 3)).toEqual(new Coord(3, 0, 3));
      expect(LeafNode.offsetToLocalCoord(4 * dimSquare + 4)).toEqual(new Coord(4, 0, 4));
      expect(LeafNode.offsetToLocalCoord(5 * dimSquare + 5)).toEqual(new Coord(5, 0, 5));
      expect(LeafNode.offsetToLocalCoord(6 * dimSquare + 6)).toEqual(new Coord(6, 0, 6));
      expect(LeafNode.offsetToLocalCoord(7 * dimSquare + 7)).toEqual(new Coord(7, 0, 7));

      expect(LeafNode.offsetToLocalCoord(0 * dimSquare + 0 * dim + 0)).toEqual(new Coord(0, 0, 0));
      expect(LeafNode.offsetToLocalCoord(1 * dimSquare + 1 * dim + 1)).toEqual(new Coord(1, 1, 1));
      expect(LeafNode.offsetToLocalCoord(2 * dimSquare + 2 * dim + 2)).toEqual(new Coord(2, 2, 2));
      expect(LeafNode.offsetToLocalCoord(3 * dimSquare + 3 * dim + 3)).toEqual(new Coord(3, 3, 3));
      expect(LeafNode.offsetToLocalCoord(4 * dimSquare + 4 * dim + 4)).toEqual(new Coord(4, 4, 4));
      expect(LeafNode.offsetToLocalCoord(5 * dimSquare + 5 * dim + 5)).toEqual(new Coord(5, 5, 5));
      expect(LeafNode.offsetToLocalCoord(6 * dimSquare + 6 * dim + 6)).toEqual(new Coord(6, 6, 6));
      expect(LeafNode.offsetToLocalCoord(7 * dimSquare + 7 * dim + 7)).toEqual(new Coord(7, 7, 7));
    });
  });

  describe('offsetToGlobalCoord()', () => {
    it('should calculate global coordinate from offset', () => {
      const dim = LeafNode.DIM;
      const dimSquare = LeafNode.DIM * LeafNode.DIM;

      const leaf = new LeafNode<number>(new Coord(dim, dim, dim));

      expect(leaf.offsetToGlobalCoord(0)).toEqual(new Coord(dim, dim, dim));
      expect(leaf.offsetToGlobalCoord(1)).toEqual(new Coord(dim, dim, dim + 1));
      expect(leaf.offsetToGlobalCoord(1 * dimSquare + 1)).toEqual(new Coord(dim + 1, dim, dim + 1));
      expect(leaf.offsetToGlobalCoord(1 * dimSquare + 1 * dim + 1)).toEqual(
        new Coord(dim + 1, dim + 1, dim + 1),
      );
    });
  });
});
