import { Tree } from './tree';
import { DEFAULT_TREE_PARAM } from './tree-param';

describe('Tree', () => {
  it('should construct new tree', () => {
    const tree = Tree.construct(DEFAULT_TREE_PARAM, 'testSeed', false);
  });
});
