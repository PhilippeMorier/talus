import { Grid } from '../grid';
import { nodeToMesh } from './node-to-mesh';

describe('nodeToMesh()', () => {
  it('should generate the mesh', () => {
    const grid = new Grid(0);
    const accessor = grid.getAccessor();

    accessor.setValue([0, 0, 0], 1);
    accessor.setValue([0, 0, 1], 1);

    const meshData = nodeToMesh(grid.tree.root);

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
});
