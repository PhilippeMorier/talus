/**
 * Babylon.js has a left-handed coordinate system with Y pointing up.
 * Furthermore, the front face of a facet is considered the face where the facet’s vertices
 * are positioned counterclockwise.
 *
 * Position of a facet is the location of the facet’s barycenter (a.k.a. centroid).
 *
 *                                       6-------7
 *                                      /|      /|
 *                                     / |     / |
 *           Y                        3--|----2  |
 *           |  Z                     |  5----|--4
 *           | /                      | /     | /
 *           0--- X                   0-------1
 */

import { Grid } from '@talus/vdb';

export interface MeshData {
  colors: number[];
  indices: number[];
  normals: number[];
  positions: number[];
}

export function gridToMesh(grid: Grid): MeshData {
  const mesh: MeshData = {
    positions: [],
    indices: [],
    colors: [],
    normals: [],
  };

  let vertexCount = 0;
  for (const voxel of grid.beginVoxelOn()) {
    const [x, y, z] = voxel.globalCoord;

    mesh.indices.push(...[5, 0, 3, 3, 6, 5].map(i => i + vertexCount)); // Left
    mesh.indices.push(...[1, 4, 7, 7, 2, 1].map(i => i + vertexCount)); // Right

    mesh.indices.push(...[5, 4, 1, 1, 0, 5].map(i => i + vertexCount)); // Bottom
    mesh.indices.push(...[7, 6, 3, 3, 2, 7].map(i => i + vertexCount)); // Top

    mesh.indices.push(...[0, 1, 2, 2, 3, 0].map(i => i + vertexCount)); // Front
    mesh.indices.push(...[4, 5, 6, 6, 7, 4].map(i => i + vertexCount)); // Back

    mesh.normals.push(-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0); // Left
    mesh.normals.push(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0); // Right

    mesh.normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0); // Bottom
    mesh.normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0); // Top

    mesh.normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1); // Front
    mesh.normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1); // Back

    mesh.positions.push(x, y, z); // 0
    mesh.positions.push(x + 1, y, z); // 1
    mesh.positions.push(x + 1, y + 1, z); // 2
    mesh.positions.push(x, y + 1, z); // 3

    mesh.positions.push(x + 1, y, z + 1); // 4
    mesh.positions.push(x, y, z + 1); // 5
    mesh.positions.push(x, y + 1, z + 1); // 6
    mesh.positions.push(x + 1, y + 1, z + 1); // 7

    vertexCount += 8;

    mesh.colors.push(1, 0, 0, 1);
    mesh.colors.push(1, 0, 0, 1);
    mesh.colors.push(1, 0, 0, 1);
    mesh.colors.push(1, 0, 0, 1);

    mesh.colors.push(1, 0, 0, 1);
    mesh.colors.push(1, 0, 0, 1);
    mesh.colors.push(1, 0, 0, 1);
    mesh.colors.push(1, 0, 0, 1);
  }

  return mesh;
}
