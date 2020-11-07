import { Grid } from '../grid';
import { nodeToMesh } from './node-to-mesh';

describe('nodeToMesh()', () => {
  it('should generate the mesh', () => {
    const grid = new Grid(0);
    const accessor = grid.getAccessor();

    accessor.setValueOn({ x: 0, y: 0, z: 0 }, 1);
    accessor.setValueOn({ x: 0, y: 0, z: 1 }, 1);

    const meshData = nodeToMesh(grid.tree.root, () => [0, 0, 0, 1]);

    const voxels = 2;

    const triangles = 12;
    const triangleCorners = triangles * 3;

    const xyz = 3;
    const rgba = 4;

    expect(meshData).toBeDefined();
    if (meshData) {
      expect(meshData.positions.length).toEqual(voxels * triangleCorners * xyz);
      expect(meshData.colors.length).toEqual(voxels * triangleCorners * rgba);
      expect(meshData.normals.length).toEqual(meshData.positions.length);
    }
  });

  it('should return undefined if there are no data', () => {
    const grid = new Grid(0);

    const meshData = nodeToMesh(grid.tree.root, () => [0, 0, 0, 1]);

    expect(meshData).toBeUndefined();
  });
});
