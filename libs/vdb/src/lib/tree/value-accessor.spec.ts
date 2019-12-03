import { InternalNode2 } from './internal-node';
import { Tree } from './tree';
import { ValueAccessor3 } from './value-accessor';

describe('ValueAccessor', () => {
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

  describe('setValue()', () => {
    it('should cache coordinate', () => {
      const tree = new Tree(0);

      const accessor = new ValueAccessor3(tree);

      accessor.setValue([0, 0, 0], 1496);

      expect(tree.getValue([0, 0, 0])).toEqual(1496);
      expect(accessor.isCached([0, 0, 0])).toBeTruthy();
      expect(accessor.isCached([0, 0, 8])).toBeTruthy();
      expect(accessor.isCached([0, 8, 0])).toBeTruthy();
      expect(accessor.isCached([8, 0, 0])).toBeTruthy();
      expect(accessor.isCached([0, 0, InternalNode2.DIM - 1])).toBeTruthy();
      expect(accessor.isCached([0, 0, InternalNode2.DIM])).toBeFalsy();
    });
  });
});
