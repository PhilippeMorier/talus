import { Grid } from '@talus/vdb';
import { benchmark, suite } from '../../main';

suite('[Grid] getValue()', () => {
  const grid = new Grid(-1);
  const accessor = grid.getAccessor();
  const i = 42;

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
  const grid = new Grid(-1);
  const accessor = grid.getAccessor();
  const i = 42;

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
