import { Chunk } from '../world/chunk';
import { add3, Vector3, X, Y, Z } from '../world/vector3';

export interface MeshData {
  colors: number[];
  indices: number[];
  positions: number[];
}

export function getNaiveMesh(chunk: Chunk): MeshData {
  const colors = [];
  const indices = [];
  const positions = [];

  const color = [...getRandomColor(), 1];

  let indicesCount = 0;
  for (let iX = 0; iX < chunk.size[X]; iX++) {
    for (let iY = 0; iY < chunk.size[Y]; iY++) {
      for (let iZ = 0; iZ < chunk.size[Z]; iZ++) {
        const voxel = chunk.getVoxel([iX, iY, iZ]);

        if (voxel.type !== 0) {
          //    5-------6
          //   /|      /|
          //  / |     / |
          // 4--|----7  |     Y
          // |  1----|--2     |  Z
          // | /     | /      | /
          // 0-------3        0--- X

          const [x, y, z]: Vector3 = add3(chunk.position, [iX, iY, iZ]);

          colors.push(...color);
          colors.push(...color);
          colors.push(...color);
          colors.push(...color);

          colors.push(...color);
          colors.push(...color);
          colors.push(...color);
          colors.push(...color);

          positions.push(x, y, z); // 0
          positions.push(x, y, z + 1); // 1
          positions.push(x + 1, y, z + 1); // 2
          positions.push(x + 1, y, z); // 3

          positions.push(x, y + 1, z); // 4
          positions.push(x, y + 1, z + 1); // 5
          positions.push(x + 1, y + 1, z + 1); // 6
          positions.push(x + 1, y + 1, z); // 7

          indices.push(...[0, 1, 2, 0, 2, 3].map(i => i + indicesCount)); // Bottom
          indices.push(...[4, 6, 5, 4, 7, 6].map(i => i + indicesCount)); // Top

          indices.push(...[0, 3, 7, 0, 7, 4].map(i => i + indicesCount)); // Back
          indices.push(...[1, 5, 6, 1, 6, 2].map(i => i + indicesCount)); // Front

          indices.push(...[0, 4, 5, 0, 5, 1].map(i => i + indicesCount)); // Left
          indices.push(...[3, 6, 7, 3, 2, 6].map(i => i + indicesCount)); // Right

          indicesCount += 8;
        }
      }
    }
  }

  return { colors, indices, positions };
}

function getRandomColor(): Vector3 {
  return [Math.random(), Math.random(), Math.random()];
}
