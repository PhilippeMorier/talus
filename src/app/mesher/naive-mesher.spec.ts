import { Chunk } from '../world/chunk';
import { Voxel } from '../world/world';
import { getNaiveMesh, MeshData } from './naive-mesher';

describe('Naive mesher', () => {
  it('should get the mesh for a single chunk', () => {
    const expectedMesh: MeshData = {
      indices: [0, 1, 2, 1, 0, 3, 4, 5, 6, 5, 4, 7],
      positions: [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 3, 3, 3, 4, 4, 3, 3, 4, 3, 4, 3, 3],
      colors: [],
    };

    const chunk: Chunk = new Chunk([4, 4, 4], [0, 0, 0]);
    chunk.voxels[0][0][0] = new Voxel(1, 42);
    chunk.voxels[3][3][3] = new Voxel(1, 42);
    const mesh: MeshData = getNaiveMesh(chunk);

    expect(mesh).toEqual(expectedMesh);
  });
});
