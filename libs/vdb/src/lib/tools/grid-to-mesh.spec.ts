import { Grid } from '../grid';
import { gridToMesh } from './grid-to-mesh';

describe('gridToMesh()', () => {
  it('should generate the mesh', () => {
    const grid = new Grid(0);
    const accessor = grid.getAccessor();

    accessor.setValue([0, 0, 0], 1);
    accessor.setValue([0, 0, 1], 1);

    const meshData = gridToMesh(grid.beginVoxelOn());

    const voxels = 2;

    const corners = 8;
    const triangles = 12;

    const xyz = 3;
    const rgba = 4;

    expect(meshData.positions.length).toEqual(voxels * corners * xyz);
    expect(meshData.colors.length).toEqual(voxels * corners * rgba);
    expect(meshData.indices.length).toEqual(voxels * triangles * xyz);
  });
});
