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
      expect(LeafNode.coordToOffset([0, 0, 0])).toEqual(0);
      expect(LeafNode.coordToOffset([0, 0, 8])).toEqual(0);

      expect(LeafNode.coordToOffset([0, 0, 1])).toEqual(1);
      expect(LeafNode.coordToOffset([0, 0, 2])).toEqual(2);
      expect(LeafNode.coordToOffset([0, 0, 3])).toEqual(3);
      expect(LeafNode.coordToOffset([0, 0, 4])).toEqual(4);
      expect(LeafNode.coordToOffset([0, 0, 5])).toEqual(5);
      expect(LeafNode.coordToOffset([0, 0, 6])).toEqual(6);
      expect(LeafNode.coordToOffset([0, 0, 7])).toEqual(7);

      expect(LeafNode.coordToOffset([0, 1, 0])).toEqual(8);
      expect(LeafNode.coordToOffset([0, 1, 1])).toEqual(9);
      expect(LeafNode.coordToOffset([0, 1, 2])).toEqual(10);
      expect(LeafNode.coordToOffset([0, 1, 3])).toEqual(11);
      expect(LeafNode.coordToOffset([0, 1, 4])).toEqual(12);
      expect(LeafNode.coordToOffset([0, 1, 5])).toEqual(13);
      expect(LeafNode.coordToOffset([0, 1, 6])).toEqual(14);
      expect(LeafNode.coordToOffset([0, 1, 7])).toEqual(15);

      expect(LeafNode.coordToOffset([1, 0, 0])).toEqual(64);
      expect(LeafNode.coordToOffset([1, 0, 1])).toEqual(65);
      expect(LeafNode.coordToOffset([1, 0, 2])).toEqual(66);
      expect(LeafNode.coordToOffset([1, 0, 3])).toEqual(67);
      expect(LeafNode.coordToOffset([1, 0, 4])).toEqual(68);
      expect(LeafNode.coordToOffset([1, 0, 5])).toEqual(69);
      expect(LeafNode.coordToOffset([1, 0, 6])).toEqual(70);
      expect(LeafNode.coordToOffset([1, 0, 7])).toEqual(71);
    });
  });

  describe('[set|get]ValueOn()', () => {
    it('should set/get value on at given coordinate', () => {
      const leaf = new LeafNode<number>([0, 0, 0]);

      leaf.setValueOn([0, 0, 0], 42);
      leaf.setValueOn([0, 1, 0], 43);
      leaf.setValueOn([1, 0, 0], 44);

      expect(leaf.getValue([0, 0, 0])).toEqual(42);
      expect(leaf.getValue([0, 1, 0])).toEqual(43);
      expect(leaf.getValue([1, 0, 0])).toEqual(44);

      expect(leaf.getValue([1, 1, 1])).toBeUndefined();
    });
  });

  describe('onVoxelCount()', () => {
    it('should count all activated voxels', () => {
      const leaf = new LeafNode<number>([0, 0, 0]);

      let onCounter = 0;
      for (let x = 0; x < LeafNode.DIM; x++) {
        for (let y = 0; y < LeafNode.DIM; y++) {
          for (let z = 0; z < LeafNode.DIM; z++) {
            leaf.setValueOn([x, y, z], 42);
            onCounter++;

            expect(leaf.onVoxelCount()).toEqual(onCounter);
          }
        }
      }

      expect(onCounter).toEqual(Math.pow(LeafNode.DIM, 3));
    });
  });
});