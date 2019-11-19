import { RootNode } from './root-node';

describe('RootNode', () => {
  describe('setValueOn()', () => {
    it('should set given value and activate it', () => {
      const root = new RootNode(false);

      root.setValueOn([0, 0, 0], true);
      root.setValueOn([682674, 456739, 5254475876], true);

      expect(root.getValue([0, 0, 0])).toEqual(true);
      expect(root.getValue([682674, 456739, 5254475876])).toEqual(true);
    });
  });
});
