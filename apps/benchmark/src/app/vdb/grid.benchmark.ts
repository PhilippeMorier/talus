import { Grid } from '@talus/vdb';
import { benchmark, suite } from '../../main';

suite('[Grid] getValue()', () => {
  const i = 42;
  const grid = initializeGrid(i);
  const accessor = grid.getAccessor();

  benchmark('tree', () => {
    for (let x = 0; x < i; x++) {
      for (let y = 0; y < i; y++) {
        for (let z = 0; z < i; z++) {
          grid.tree.getValue([x, y, z]);
        }
      }
    }
  });

  benchmark('accessor', () => {
    for (let x = 0; x < i; x++) {
      for (let y = 0; y < i; y++) {
        for (let z = 0; z < i; z++) {
          accessor.getValue([x, y, z]);
        }
      }
    }
  });
});

suite('[Grid] setValue()', () => {
  const i = 42;
  const grid = initializeGrid(i);
  const accessor = grid.getAccessor();

  benchmark('tree', () => {
    for (let x = 0; x < i; x++) {
      for (let y = 0; y < i; y++) {
        for (let z = 0; z < i; z++) {
          grid.tree.setValueOn([x, y, z], i);
        }
      }
    }
  });

  benchmark('accessor', () => {
    for (let x = 0; x < i; x++) {
      for (let y = 0; y < i; y++) {
        for (let z = 0; z < i; z++) {
          accessor.setValue([x, y, z], i);
        }
      }
    }
  });
});

/**
 * Setting actual values causes the tree to create child nodes and therefore if a voxel
 * gets requested the tree needs to be traversed. Otherwise, the tree immediately can return
 * the background value without traversing down the tree. This would distort the benchmark.
 */
function initializeGrid(i: number): Grid {
  const grid = new Grid(-1);

  for (let x = 0; x < i; x++) {
    for (let y = 0; y < i; y++) {
      for (let z = 0; z < i; z++) {
        grid.tree.setValueOn([x, y, z], i);
      }
    }
  }

  return grid;
}
