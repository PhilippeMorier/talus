import { InternalNode2 } from './internal-node';
import { RootNode } from './root-node';

describe('RootNode', () => {
  describe('setValueOn()', () => {
    it('should set given value and activate it', () => {
      const root = new RootNode(-1);

      root.setValueOn([0, 0, 0], 24);
      root.setValueOn([102, 15, 127], 42);

      expect(root.getValue([0, 0, 0])).toEqual(24);
      expect(root.getValue([102, 15, 127])).toEqual(42);

      expect(root.isValueOn([0, 0, 0])).toEqual(true);
      expect(root.isValueOn([102, 15, 127])).toEqual(true);

      expect(root.getValue([1, 1, 1])).toEqual(-1);
    });
  });

  describe('onVoxelCount()', () => {
    it('should count all activated voxels', () => {
      const root = new RootNode(-1);

      root.setValueOn([0, 0, 0], 24);
      root.setValueOn([102, 15, 127], 42);

      expect(root.onVoxelCount()).toEqual(2);
    });
  });

  describe('getTableSize()', () => {
    it('should create new entries when inserting values', () => {
      const root = new RootNode(-1);

      root.setValueOn([0, 0, 0], 24);
      root.setValueOn([0, 0, 1], 24);
      root.setValueOn([102, 15, 127], 42);
      expect(root.getTableSize()).toEqual(1);

      root.setValueOn([0, 0, InternalNode2.DIM], 42);
      root.setValueOn([0, 1, InternalNode2.DIM], 42);
      root.setValueOn([1, 0, InternalNode2.DIM], 42);
      expect(root.getTableSize()).toEqual(2);

      root.setValueOn([InternalNode2.DIM, 0, 0], 42);
      root.setValueOn([InternalNode2.DIM, 0, 1], 42);
      root.setValueOn([InternalNode2.DIM, 1, 0], 42);
      expect(root.getTableSize()).toEqual(3);
    });
  });

  describe('beginVoxelOn()', () => {
    it('should iterate over all activated voxels', () => {
      const root = new RootNode(-1);
      const expectedValues = [0, 1, 2, 3];

      root.setValueOn([0, 0, 0], expectedValues[0]);
      root.setValueOn([0, 0, InternalNode2.DIM], expectedValues[1]);
      root.setValueOn([0, InternalNode2.DIM, 0], expectedValues[2]);
      root.setValueOn([InternalNode2.DIM, 0, 0], expectedValues[3]);

      let counter = 0;
      for (const voxel of root.beginVoxelOn()) {
        expect(voxel.value).toEqual(expectedValues[counter]);
        counter++;
      }

      expect(counter).toEqual(expectedValues.length);
    });
  });
});
