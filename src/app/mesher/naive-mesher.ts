import { Vector3 } from '../world/vector3';
import { VoxelResult, World } from '../world/world';

export function getNaiveMesh(world: World, objectId: number, from: Vector3, to: Vector3): number[] {
  const vertices: number[] = [];

  const iterator = world.iterate(from, to);
  let result: IteratorResult<VoxelResult>;
  while (!(result = iterator.next()).done) {
    const [x, y, z] = result.value.index;
    // x-y front-plane (red-green)
    vertices.push(x, y, z);
    vertices.push(x, y + 1.0, z);
    vertices.push(x + 1.0, y + 1.0, z);

    vertices.push(x + 1.0, y + 1.0, z);
    vertices.push(x + 1.0, y, z);
    vertices.push(x, y, z);

    // x-y back-plane (red-green)
    const backZ = z + 1.0;
    vertices.push(x, y, backZ);
    vertices.push(x + 1.0, y + 1.0, backZ);
    vertices.push(x, y + 1.0, backZ);

    vertices.push(x + 1.0, y + 1.0, backZ);
    vertices.push(x, y, backZ);
    vertices.push(x + 1.0, y, backZ);

    // y-z front-plane (green-blue)
    vertices.push(x, y, z);
    vertices.push(x, y + 1.0, z + 1.0);
    vertices.push(x, y + 1.0, z);

    vertices.push(x, y + 1.0, z + 1.0);
    vertices.push(x, y, z);
    vertices.push(x, y, z + 1.0);

    // y-z back-plane
    const backX = x + 1;
    vertices.push(backX, y, z);
    vertices.push(backX, y + 1.0, z);
    vertices.push(backX, y + 1.0, z + 1.0);

    vertices.push(backX, y + 1.0, z + 1.0);
    vertices.push(backX, y, z + 1.0);
    vertices.push(backX, y, z);

    // x-z front-plane (red-blue)
    vertices.push(x, y, z);
    vertices.push(x + 1.0, y, z);
    vertices.push(x + 1.0, y, z + 1.0);

    vertices.push(x + 1.0, y, z + 1.0);
    vertices.push(x, y, z + 1.0);
    vertices.push(x, y, z);

    // x-z back-plane
    const backY = y + 1;
    vertices.push(x, backY, z);
    vertices.push(x + 1.0, backY, z);
    vertices.push(x + 1.0, backY, z + 1.0);

    vertices.push(x + 1.0, backY, z + 1.0);
    vertices.push(x, backY, z + 1.0);
    vertices.push(x, backY, z);
  }

  return vertices;
}
