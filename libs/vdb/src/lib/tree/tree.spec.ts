import { Tree } from './tree';

describe('Tree', () => {
  it('should get background', () => {
    const tree = new Tree(-1);

    expect(tree.background).toEqual(-1);
  });

  it('should get/set value', () => {
    const tree = new Tree(-1);

    tree.setValueOn({ x: 0, y: 1, z: 2 }, 42);

    expect(tree.getValue({ x: 0, y: 1, z: 2 })).toEqual(42);
  });

  it('should return background value on unset voxel', () => {
    const tree = new Tree(-1);

    expect(tree.getValue({ x: 0, y: 0, z: 0 })).toEqual(tree.background);
  });

  it('should activated value', () => {
    const tree = new Tree(-1);

    tree.setValueOn({ x: 0, y: 1, z: 2 }, 42);

    expect(tree.isValueOn({ x: 0, y: 1, z: 2 })).toBeTruthy();
  });

  it('should count voxel', () => {
    const tree = new Tree(-1);

    tree.setValueOn({ x: 0, y: 1, z: 2 }, 42);
    tree.setValueOn({ x: 845, y: 242, z: 64 }, 42);
    tree.setValueOn({ x: 1000, y: 4000, z: 200000 }, 42);

    expect(tree.onVoxelCount()).toEqual(3);
  });

  it('should iterate over each activated voxel', () => {
    const tree = new Tree(-1);

    tree.setValueOn({ x: 0, y: 1, z: 2 }, 42);
    tree.setValueOn({ x: 845, y: 242, z: 64 }, 42);
    tree.setValueOn({ x: 1000, y: 4000, z: 200000 }, 42);

    let counter = 0;
    for (const voxel of tree.beginVoxelOn()) {
      counter++;
      expect(voxel.value).toEqual(42);
    }

    expect(counter).toEqual(3);
  });
});
