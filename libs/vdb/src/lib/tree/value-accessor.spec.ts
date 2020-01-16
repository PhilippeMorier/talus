import { LeafNode } from '@talus/vdb';
import { InternalNode1, InternalNode2 } from './internal-node';
import { Tree } from './tree';
import { ValueAccessor3 } from './value-accessor';

describe('ValueAccessor', () => {
  it('should return background', () => {
    const tree = new Tree(-1);
    const accessor = new ValueAccessor3(tree);

    expect(accessor.getValue([111, 222, 333])).toEqual(-1);
  });

  describe('getValue()', () => {
    it('should cache coordinate', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      tree.setValueOn([0, 0, 0], 1496);
      const value = accessor.getValue([0, 0, 0]);

      expect(value).toEqual(1496);

      expect(accessor.isCached([0, 0, 0])).toBeTruthy();
      expect(accessor.isCached([0, 0, 8])).toBeTruthy();
      expect(accessor.isCached([0, 8, 0])).toBeTruthy();
      expect(accessor.isCached([8, 0, 0])).toBeTruthy();
      expect(accessor.isCached([0, 0, InternalNode2.DIM - 1])).toBeTruthy();
      expect(accessor.isCached([0, 0, InternalNode2.DIM])).toBeFalsy();
    });
  });

  describe('setValueOn()', () => {
    it('should cache coordinate', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn([0, 0, 0], 1496);
      const value = accessor.getValue([0, 0, 0]);

      expect(value).toEqual(1496);

      expect(accessor.isCached([0, 0, 0])).toBeTruthy();
      expect(accessor.isCached([0, 0, 8])).toBeTruthy();
      expect(accessor.isCached([0, 8, 0])).toBeTruthy();
      expect(accessor.isCached([8, 0, 0])).toBeTruthy();
      expect(accessor.isCached([0, 0, InternalNode2.DIM - 1])).toBeTruthy();
      expect(accessor.isCached([0, 0, InternalNode2.DIM])).toBeFalsy();

      expect(accessor.isValueOn([0, 0, 0])).toBeTruthy();
    });
  });

  describe('setValueOff()', () => {
    it('should cache coordinate', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOff([0, 0, 0], 1496);
      const value = accessor.getValue([0, 0, 0]);

      expect(value).toEqual(1496);

      expect(accessor.isCached([0, 0, 0])).toBeTruthy();
      expect(accessor.isCached([0, 0, 8])).toBeTruthy();
      expect(accessor.isCached([0, 8, 0])).toBeTruthy();
      expect(accessor.isCached([8, 0, 0])).toBeTruthy();
      expect(accessor.isCached([0, 0, InternalNode2.DIM - 1])).toBeTruthy();
      expect(accessor.isCached([0, 0, InternalNode2.DIM])).toBeFalsy();

      expect(accessor.isValueOn([0, 0, 0])).toBeFalsy();
    });
  });

  describe('setActiveState()', () => {
    it('should set state', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn([0, 0, 0], 1496);
      expect(accessor.getValue([0, 0, 0])).toEqual(1496);
      expect(accessor.isValueOn([0, 0, 0])).toEqual(true);

      accessor.setActiveState([0, 0, 0], false);
      expect(accessor.getValue([0, 0, 0])).toEqual(1496);
      expect(accessor.isValueOn([0, 0, 0])).toBeFalsy();

      accessor.setActiveState([0, 0, 0], true);
      expect(accessor.getValue([0, 0, 0])).toEqual(1496);
      expect(accessor.isValueOn([0, 0, 0])).toBeTruthy();

      expect(accessor.isCached([0, 0, 0])).toBeTruthy();
    });
  });

  describe('isValueOn()', () => {
    it('should set value and (de)activate voxel', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn([0, 0, 1], 4321);
      accessor.setValueOff([42, 638, 2], 1234);

      expect(accessor.getValue([0, 0, 1])).toEqual(4321);
      expect(accessor.getValue([42, 638, 2])).toEqual(1234);

      expect(accessor.isValueOn([0, 0, 1])).toBeTruthy();
      expect(accessor.isValueOn([42, 638, 2])).toBeFalsy();

      accessor.setValueOff([0, 0, 1], 1);
      expect(accessor.isValueOn([0, 0, 1])).toBeFalsy();
    });
  });

  describe('probeInternalNode1()', () => {
    const tree = new Tree(-1);

    it('should return undefined if no internal node 1', () => {
      const accessor = new ValueAccessor3(tree);

      expect(accessor.probeInternalNode1([111, 222, 333])).toBeUndefined();
    });

    it('should hit no cache and return internal node 1', () => {
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn([0, 0, 0], 42);
      // Produce a cache miss (go over root)
      accessor.setValueOn([InternalNode2.DIM, 0, 0], 42);

      expect(accessor.probeInternalNode1([32, 0, 0])).toBeInstanceOf(InternalNode1);
    });

    it('should hit cache L2 and return internal node 1', () => {
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn([0, 0, 0], 42);
      // Produce a cache miss (go over InternalNode2)
      accessor.setValueOn([InternalNode1.DIM, 0, 0], 42);

      expect(accessor.probeInternalNode1([32, 0, 0])).toBeInstanceOf(InternalNode1);
    });

    it('should hit cache L1 and return internal node 1', () => {
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn([0, 0, 0], 42);

      expect(accessor.probeInternalNode1([LeafNode.DIM, 0, 0])).toBeInstanceOf(InternalNode1);
    });
  });
});
