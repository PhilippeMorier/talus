import { LeafNode } from './leaf-node';

describe('LeafNode', () => {
  describe('coordToOffset()', () => {
    it('should calculate the offset', () => {
      expect(LeafNode.coordToOffset([0, 0, 0])).toEqual(0);
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
});
