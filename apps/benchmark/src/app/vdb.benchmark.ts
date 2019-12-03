import { Grid, InternalNode2 } from '@talus/vdb';
import { benchmark, suite } from '../main';

suite('vdb > getValue', () => {
  const grid = new Grid(-1);
  const accessor = grid.getAccessor();

  benchmark('tree', () => {
    for (let z = 0; z < InternalNode2.DIM; z++) {
      grid.tree.getValue([0, 0, z]);
    }
  });

  benchmark('accessor', () => {
    for (let z = 0; z < InternalNode2.DIM; z++) {
      accessor.getValue([0, 0, z]);
    }
  });
});
