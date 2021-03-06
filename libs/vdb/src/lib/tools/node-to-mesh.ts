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

import { HashableNode } from '../tree';

export interface MeshData {
  colors: number[];
  normals: number[];
  positions: number[];
}

/**
 * Returns a mesh if there are any active voxels saved in the grid.
 * Otherwise, returns `undefined` i.e. if there are no active voxels.
 *
 * Doesn't use indices, since it is more efficient to send 32 positions
 * instead of 24 positions and 32 indices for a cube.
 * See: https://doc.babylonjs.com/how_to/optimizing_your_scene#using-unindexed-meshes
 */
export function nodeToMesh<T>(
  node: HashableNode<T>,
  valueToColor: (value: T) => [number, number, number, number],
): MeshData | undefined {
  const mesh: MeshData = {
    colors: [],
    positions: [],
    normals: [],
  };

  for (const voxel of node.beginVoxelOn()) {
    const { x, y, z } = voxel.globalCoord;
    const [r, g, b, a] = valueToColor(voxel.value);

    const v0 = [x, y, z];
    const v1 = [x + 1, y, z];
    const v2 = [x + 1, y + 1, z];
    const v3 = [x, y + 1, z];
    const v4 = [x + 1, y, z + 1];
    const v5 = [x, y, z + 1];
    const v6 = [x, y + 1, z + 1];
    const v7 = [x + 1, y + 1, z + 1];

    mesh.positions.push(
      // Front
      v4[0],
      v4[1],
      v4[2],
      v5[0],
      v5[1],
      v5[2],
      v6[0],
      v6[1],
      v6[2],
      v4[0],
      v4[1],
      v4[2],
      v6[0],
      v6[1],
      v6[2],
      v7[0],
      v7[1],
      v7[2],

      // Back
      v0[0],
      v0[1],
      v0[2],
      v1[0],
      v1[1],
      v1[2],
      v2[0],
      v2[1],
      v2[2],
      v0[0],
      v0[1],
      v0[2],
      v2[0],
      v2[1],
      v2[2],
      v3[0],
      v3[1],
      v3[2],

      // Left
      v5[0],
      v5[1],
      v5[2],
      v0[0],
      v0[1],
      v0[2],
      v3[0],
      v3[1],
      v3[2],
      v5[0],
      v5[1],
      v5[2],
      v3[0],
      v3[1],
      v3[2],
      v6[0],
      v6[1],
      v6[2],

      // Right
      v1[0],
      v1[1],
      v1[2],
      v4[0],
      v4[1],
      v4[2],
      v7[0],
      v7[1],
      v7[2],
      v1[0],
      v1[1],
      v1[2],
      v7[0],
      v7[1],
      v7[2],
      v2[0],
      v2[1],
      v2[2],

      // Top
      v3[0],
      v3[1],
      v3[2],
      v2[0],
      v2[1],
      v2[2],
      v7[0],
      v7[1],
      v7[2],
      v3[0],
      v3[1],
      v3[2],
      v7[0],
      v7[1],
      v7[2],
      v6[0],
      v6[1],
      v6[2],

      // Bottom
      v5[0],
      v5[1],
      v5[2],
      v4[0],
      v4[1],
      v4[2],
      v1[0],
      v1[1],
      v1[2],
      v5[0],
      v5[1],
      v5[2],
      v1[0],
      v1[1],
      v1[2],
      v0[0],
      v0[1],
      v0[2],
    );

    mesh.normals.push(
      // Front
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,

      // Back
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,

      // Left
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,

      // Right
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,

      // Top
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,

      // Bottom
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
    );

    mesh.colors.push(
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
    );
  }

  return mesh.positions.length !== 0 ? mesh : undefined;
}
