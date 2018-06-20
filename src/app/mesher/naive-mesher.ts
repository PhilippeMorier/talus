import { VoxelResult, World } from '../world/world';
import { Vector3 } from '../world/vector3';

export function getNaiveMesh(world: World, objectId: number, from: Vector3, to: Vector3): number[] {
  const vertices: number[] = [];

  const iterator = world.iterate(from, to);
  let result: IteratorResult<VoxelResult>;
  while (!(result = iterator.next()).done) {
    const [x, y, z] = result.value.index;
    // x-y plane
    vertices.push(x, y, z);
    vertices.push(x, y + 1.0, z);
    vertices.push(x + 1.0, y + 1.0, z);

    vertices.push(x + 1.0, y + 1.0, z);
    vertices.push(x + 1.0, y, z);
    vertices.push(x, y, z);

    // y-z plane
    vertices.push(x, y, z);
    vertices.push(x, y + 1, z);
    vertices.push(x, y + 1, z + 1);

    vertices.push(x, y + 1, z + 1);
    vertices.push(x, y, z + 1);
    vertices.push(x, y, z);

    // x-z plane
    vertices.push(x, y, z);
    vertices.push(x + 1, y, z);
    vertices.push(x + 1, y, z + 1);

    vertices.push(x + 1, y, z + 1);
    vertices.push(x, y, z + 1);
    vertices.push(x, y, z);
  }

  return vertices;
}
