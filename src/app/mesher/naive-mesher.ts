import { Vector3 } from '../world/vector3';
import { VoxelResult, World } from '../world/world';

export interface MeshData {
  positions: number[];
  indices: number[];
}

export function getNaiveMesh(world: World, from: Vector3, to: Vector3): MeshData {
  const positions: number[] = [];
  const indices: number[] = [];
  let i = 0;

  const iterator = world.iterate(from, to);
  let result: IteratorResult<VoxelResult>;
  while (!(result = iterator.next()).done) {
    const [x, y, z] = result.value.index;
    // x-y front-plane (red-green)
    positions.push(x, y, z);
    indices.push(i + 0);
    positions.push(x, y + 1.0, z);
    indices.push(i + 1);
    positions.push(x + 1.0, y + 1.0, z);
    indices.push(i + 2);

    // positions.push(x + 1.0, y + 1.0, z);
    indices.push(i + 2);
    // positions.push(x, y, z);
    indices.push(i + 0);
    positions.push(x + 1.0, y, z);
    indices.push(i + 3);

    i += 4;

    // // x-y back-plane (red-green)
    // const backZ = z + 1.0;
    // positions.push(x, y, backZ);
    // indices.push(i + 4);
    // positions.push(x + 1.0, y + 1.0, backZ);
    // indices.push(i + 5);
    // positions.push(x, y + 1.0, backZ);
    // indices.push(i + 6);
    //
    // // positions.push(x + 1.0, y + 1.0, backZ);
    // indices.push(i + 5);
    // // positions.push(x, y, backZ);
    // indices.push(i + 4);
    // positions.push(x + 1.0, y, backZ);
    // indices.push(i + 7);
    //
    // // y-z front-plane (green-blue)
    // // positions.push(x, y, z);
    // indices.push(i + 0);
    // positions.push(x, y + 1.0, z + 1.0);
    // indices.push(i + 8);
    // // positions.push(x, y + 1.0, z);
    // indices.push(i + 1);
    //
    // // positions.push(x, y + 1.0, z + 1.0);
    // indices.push(i + 8);
    // // positions.push(x, y, z);
    // indices.push(i + 0);
    // positions.push(x, y, z + 1.0);
    // indices.push(i + 9);
    //
    // // y-z back-plane
    // const backX = x + 1;
    // positions.push(backX, y, z);
    // indices.push(i + 10);
    // positions.push(backX, y + 1.0, z);
    // indices.push(i + 11);
    // positions.push(backX, y + 1.0, z + 1.0);
    // indices.push(i + 12);
    //
    // // positions.push(backX, y + 1.0, z + 1.0);
    // indices.push(i + 12);
    // positions.push(backX, y, z + 1.0);
    // indices.push(i + 13);
    // // positions.push(backX, y, z);
    // indices.push(i + 10);
    //
    // // x-z front-plane (red-blue)
    // // positions.push(x, y, z);
    // indices.push(i + 0);
    // // positions.push(x + 1.0, y, z);
    // indices.push(i + 3);
    // positions.push(x + 1.0, y, z + 1.0);
    // indices.push(i + 14);
    //
    // // positions.push(x + 1.0, y, z + 1.0);
    // indices.push(i + 14);
    // // positions.push(x, y, z + 1.0);
    // indices.push(i + 9);
    // // positions.push(x, y, z);
    // indices.push(i + 0);
    //
    // // x-z back-plane
    // const backY = y + 1;
    // positions.push(x, backY, z);
    // indices.push(i + 15);
    // positions.push(x + 1.0, backY, z);
    // indices.push(i + 16);
    // positions.push(x + 1.0, backY, z + 1.0);
    // indices.push(i + 17);
    //
    // // positions.push(x + 1.0, backY, z + 1.0);
    // indices.push(i + 17);
    // positions.push(x, backY, z + 1.0);
    // indices.push(i + 18);
    // // positions.push(x, backY, z);
    // indices.push(i + 15);

    // i += 19;
  }

  return { positions, indices };
}
