import { Tree } from './tree';

describe('Tree', () => {
  it('should get background', () => {
    const tree = new Tree(-1);

    expect(tree.background).toEqual(-1);
  });

  it('should get/set value', () => {
    const tree = new Tree(-1);

    tree.setValueOn([0, 1, 2], 42);

    expect(tree.getValue([0, 1, 2])).toEqual(42);
  });

  it('should activated value', () => {
    const tree = new Tree(-1);

    tree.setValueOn([0, 1, 2], 42);

    expect(tree.isValueOn([0, 1, 2])).toBeTruthy();
  });

  it('should count voxel', () => {
    const tree = new Tree(-1);

    tree.setValueOn([0, 1, 2], 42);
    tree.setValueOn([845, 242, 64], 42);
    tree.setValueOn([1000, 4000, 200000], 42);

    expect(tree.onVoxelCount()).toEqual(3);
  });

  it('should iterate over each activated voxel', () => {
    const tree = new Tree(-1);

    tree.setValueOn([0, 1, 2], 42);
    tree.setValueOn([845, 242, 64], 42);
    tree.setValueOn([1000, 4000, 200000], 42);

    let counter = 0;
    for (const voxel of tree.beginVoxelOn()) {
      counter++;
      expect(voxel.value).toEqual(42);
    }

    expect(counter).toEqual(3);
  });
});
