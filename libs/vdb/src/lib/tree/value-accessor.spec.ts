import { Coord, LeafNode } from '@talus/vdb';
import { InternalNode1, InternalNode2 } from './internal-node';
import { Tree } from './tree';
import { ValueAccessor3 } from './value-accessor';

describe('ValueAccessor', () => {
  it('should return background', () => {
    const tree = new Tree(-1);
    const accessor = new ValueAccessor3(tree);

    expect(accessor.getValue(new Coord(111, 222, 333))).toEqual(-1);
  });

  describe('getValue()', () => {
    it('should cache coordinate', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      tree.setValueOn(new Coord(0, 0, 0), 1496);
      const value = accessor.getValue(new Coord(0, 0, 0));

      expect(value).toEqual(1496);

      expect(accessor.isCached(new Coord(0, 0, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, 8))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 8, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(8, 0, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, InternalNode2.DIM - 1))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, InternalNode2.DIM))).toBeFalsy();
    });

    it('should return background value', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn(new Coord(0, 0, 0), 0);

      expect(accessor.getValue(new Coord(0, 0, 1))).toEqual(tree.background);
    });
  });

  describe('setValueOn()', () => {
    it('should cache coordinate', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn(new Coord(0, 0, 0), 1496);
      const value = accessor.getValue(new Coord(0, 0, 0));

      expect(value).toEqual(1496);

      expect(accessor.isCached(new Coord(0, 0, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, 8))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 8, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(8, 0, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, InternalNode2.DIM - 1))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, InternalNode2.DIM))).toBeFalsy();

      expect(accessor.isValueOn(new Coord(0, 0, 0))).toBeTruthy();
    });

    it('should get background', () => {
      const tree = new Tree(-1);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn(new Coord(0, 0, 0), -1);
      accessor.setActiveState(new Coord(0, 0, 0), false);

      expect(accessor.getValue(new Coord(0, 0, 0))).toEqual(-1);
      expect(accessor.isValueOn(new Coord(0, 0, 0))).toEqual(false);
    });
  });

  describe('setValueOff()', () => {
    it('should cache coordinate', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOff(new Coord(0, 0, 0), 1496);
      const value = accessor.getValue(new Coord(0, 0, 0));

      expect(value).toEqual(1496);

      expect(accessor.isCached(new Coord(0, 0, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, 8))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 8, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(8, 0, 0))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, InternalNode2.DIM - 1))).toBeTruthy();
      expect(accessor.isCached(new Coord(0, 0, InternalNode2.DIM))).toBeFalsy();

      expect(accessor.isValueOn(new Coord(0, 0, 0))).toBeFalsy();
    });
  });

  describe('setActiveState()', () => {
    it('should set state', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn(new Coord(0, 0, 0), 1496);
      expect(accessor.getValue(new Coord(0, 0, 0))).toEqual(1496);
      expect(accessor.isValueOn(new Coord(0, 0, 0))).toEqual(true);

      accessor.setActiveState(new Coord(0, 0, 0), false);
      expect(accessor.getValue(new Coord(0, 0, 0))).toEqual(1496);
      expect(accessor.isValueOn(new Coord(0, 0, 0))).toBeFalsy();

      accessor.setActiveState(new Coord(0, 0, 0), true);
      expect(accessor.getValue(new Coord(0, 0, 0))).toEqual(1496);
      expect(accessor.isValueOn(new Coord(0, 0, 0))).toBeTruthy();

      expect(accessor.isCached(new Coord(0, 0, 0))).toBeTruthy();
    });
  });

  describe('isValueOn()', () => {
    it('should set value and (de)activate voxel', () => {
      const tree = new Tree(0);
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn(new Coord(0, 0, 1), 4321);
      accessor.setValueOff(new Coord(42, 638, 2), 1234);

      expect(accessor.getValue(new Coord(0, 0, 1))).toEqual(4321);
      expect(accessor.getValue(new Coord(42, 638, 2))).toEqual(1234);

      expect(accessor.isValueOn(new Coord(0, 0, 1))).toBeTruthy();
      expect(accessor.isValueOn(new Coord(42, 638, 2))).toBeFalsy();

      accessor.setValueOff(new Coord(0, 0, 1), 1);
      expect(accessor.isValueOn(new Coord(0, 0, 1))).toBeFalsy();
    });
  });

  describe('probeInternalNode1()', () => {
    const tree = new Tree(-1);

    it('should return undefined if no internal node 1', () => {
      const accessor = new ValueAccessor3(tree);

      expect(accessor.probeInternalNode1(new Coord(111, 222, 333))).toBeUndefined();
    });

    it('should hit no cache and return internal node 1', () => {
      const accessor = new ValueAccessor3(tree);
      spyOn(tree.root, 'probeInternalNode1AndCache').and.callThrough();

      accessor.setValueOn(new Coord(0, 0, 0), 42);
      // Produce a cache L2 miss by accessing neighbouring InternalNode2
      accessor.setValueOn(new Coord(InternalNode2.DIM, 0, 0), 42);

      expect(accessor.probeInternalNode1(new Coord(32, 0, 0))).toBeInstanceOf(InternalNode1);
      expect(tree.root.probeInternalNode1AndCache).toBeCalledTimes(1);
    });

    it('should hit cache L2 and return internal node 1', () => {
      const accessor = new ValueAccessor3(tree);
      spyOn(tree.root, 'probeInternalNode1AndCache').and.callThrough();

      accessor.setValueOn(new Coord(0, 0, 0), 42);
      // Produce a cache L1 miss by accessing neighbouring InternalNode1
      accessor.setValueOn(new Coord(InternalNode1.DIM, 0, 0), 42);

      expect(accessor.probeInternalNode1(new Coord(32, 0, 0))).toBeInstanceOf(InternalNode1);
      expect(tree.root.probeInternalNode1AndCache).not.toHaveBeenCalled();
    });

    it('should hit cache L1 and return internal node 1', () => {
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn(new Coord(0, 0, 0), 42);

      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const isHashed2Spy = spyOn<any>(accessor, 'isHashed2');
      expect(accessor.probeInternalNode1(new Coord(LeafNode.DIM, 0, 0))).toBeInstanceOf(
        InternalNode1,
      );
      expect(isHashed2Spy.calls.count()).toEqual(0);
    });
  });

  describe('probeLeafNode()', () => {
    const tree = new Tree(-1);

    it('should return undefined if no leaf node', () => {
      const accessor = new ValueAccessor3(tree);

      expect(accessor.probeLeafNode(new Coord(111, 222, 333))).toBeUndefined();
    });

    it('should hit no cache and return leaf node', () => {
      const accessor = new ValueAccessor3(tree);
      spyOn(tree.root, 'probeLeafNodeAndCache').and.callThrough();

      accessor.setValueOn(new Coord(0, 0, 0), 42);
      // Produce a cache L2 miss by accessing neighbouring InternalNode2
      accessor.setValueOn(new Coord(InternalNode2.DIM, 0, 0), 42);

      expect(accessor.probeLeafNode(new Coord(LeafNode.DIM - 1, 0, 0))).toBeInstanceOf(LeafNode);
      expect(tree.root.probeLeafNodeAndCache).toBeCalledTimes(1);
    });

    it('should hit cache L2 and return leaf node', () => {
      const accessor = new ValueAccessor3(tree);
      spyOn(tree.root, 'probeLeafNodeAndCache').and.callThrough();

      accessor.setValueOn(new Coord(0, 0, 0), 42);
      // Produce a cache L1 miss by accessing neighbouring InternalNode1
      accessor.setValueOn(new Coord(InternalNode1.DIM, 0, 0), 42);

      expect(accessor.probeLeafNode(new Coord(0, LeafNode.DIM - 1, 0))).toBeInstanceOf(LeafNode);
      expect(tree.root.probeLeafNodeAndCache).not.toHaveBeenCalled();
    });

    it('should hit cache L1 and return leaf node', () => {
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn(new Coord(0, 0, 0), 42);
      // Produce a cache L0 miss by accessing neighbouring LeafNode
      accessor.setValueOn(new Coord(LeafNode.DIM, 0, 0), 42);

      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const isHashed2Spy = spyOn<any>(accessor, 'isHashed2').and.callThrough();
      expect(accessor.probeLeafNode(new Coord(0, LeafNode.DIM - 1, 0))).toBeInstanceOf(LeafNode);
      expect(isHashed2Spy.calls.count()).toEqual(0);
    });

    it('should hit cache L0 and return leaf node', () => {
      const accessor = new ValueAccessor3(tree);

      accessor.setValueOn(new Coord(0, 0, 0), 42);

      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const isHashed1Spy = spyOn<any>(accessor, 'isHashed1').and.callThrough();
      expect(accessor.probeLeafNode(new Coord(0, 0, LeafNode.DIM - 1))).toBeInstanceOf(LeafNode);
      expect(isHashed1Spy.calls.count()).toEqual(0);
    });
  });

  describe('touchLeaf()', () => {
    const tree = new Tree(-1);

    it('should create not existing leaf node and return it', () => {
      const accessor = new ValueAccessor3(tree);

      expect(accessor.probeLeafNode(new Coord(0, 0, 0))).toBeUndefined();

      const newLeaf = accessor.touchLeaf(new Coord(0, 0, 0));

      expect(newLeaf).toBeDefined();
      expect(accessor.probeLeafNode(new Coord(0, 0, 0))).toBeDefined();
      expect(accessor.probeLeafNode(new Coord(0, 0, 0))).toBe(newLeaf);
    });
  });
});
