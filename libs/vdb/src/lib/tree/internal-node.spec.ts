import { InternalNode } from './internal-node';

describe('InternalNode', () => {
  describe('setValueOn()', () => {
    it('should set the value and set it as active at the given index', () => {
      const child = new InternalNode<boolean>();

      child.setValueOn([0, 0, 0], true);

      expect(child.getValue([0, 0, 0])).toEqual(true);
    });
  });
});
