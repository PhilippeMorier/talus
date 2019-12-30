import { ValueAccessorPath } from './value-accessor-path';

describe('ValueAccessorPath', () => {
  describe('add()', () => {
    it('should add origins to existing path', () => {
      const path = new ValueAccessorPath([0, 0, 0], [0, 0, 0], [0, 0, 0]);
      const pathToAdd = new ValueAccessorPath([0, 0, 1], [0, 0, 1], [0, 0, 1]);
      const pathDuplicate = new ValueAccessorPath([0, 0, 1], [0, 0, 1], [0, 0, 1]);

      path.add(pathToAdd);
      path.add(pathDuplicate);

      expect(path.leafNodeOrigins.length).toEqual(2);
      expect(path.internalNode1Origins.length).toEqual(2);
      expect(path.internalNode2Origins.length).toEqual(2);
    });
  });
});
