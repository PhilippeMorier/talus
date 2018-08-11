import { Chunk } from './chunk';
import { Vector3 } from './vector3';

export interface VoxelResult {
  voxel: Voxel;
  index: Vector3;
}

export class Voxel {
  constructor(public objectId: number, public type: number) {}
}

interface Position {
  c: Vector3;
  v: Vector3;
}

export class World {
  private chunks: Chunk[][][] = [];

  constructor(private readonly size: Vector3, private readonly chunkSize: Vector3) {
    const [sizeX, sizeY] = size;
    this.chunks = new Array(sizeX); // TODO: this creates HOLES, use .push to keep array PACKED *elements types)

    for (let x = 0; x < sizeX; x++) {
      this.chunks[x] = new Array(sizeY);
      for (let y = 0; y < sizeY; y++) {
        this.chunks[x][y] = [];
      }
    }
  }

  get length(): Vector3 {
    return [
      this.size[0] * this.chunkSize[0],
      this.size[1] * this.chunkSize[1],
      this.size[2] * this.chunkSize[2],
    ];
  }

  *iterate(
    [minX, minY, minZ]: Vector3,
    [maxX, maxY, maxZ]: Vector3,
  ): IterableIterator<VoxelResult> {
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const voxel = this.getVoxel([x, y, z]);
          if (voxel) {
            yield { index: [x, y, z], voxel: voxel };
          }
        }
      }
    }
  }

  getVoxel(position: Vector3): Voxel | undefined {
    const { c, v } = this.calcPosition(position);
    const chunk = this.chunks[c[0]][c[1]][c[2]];

    if (!chunk) {
      return undefined;
    }

    return chunk.voxels[v[0]][v[1]][v[2]];
  }

  setVoxel(position: Vector3, voxel: Voxel): void {
    const { c, v } = this.calcPosition(position);

    const chunk = this.chunks[c[0]][c[1]][c[2]];
    if (!chunk) {
      this.chunks[c[0]][c[1]][c[2]] = new Chunk(this.chunkSize);
    }

    this.chunks[c[0]][c[1]][c[2]].voxels[v[0]][v[1]][v[2]] = voxel;
  }

  private calcPosition([x, y, z]: Vector3): Position {
    const c: Vector3 = [
      Math.floor(x / this.chunkSize[0]),
      Math.floor(y / this.chunkSize[1]),
      Math.floor(z / this.chunkSize[2]),
    ];
    const v: Vector3 = [x % this.chunkSize[0], y % this.chunkSize[1], z % this.chunkSize[2]];

    return { c, v };
  }
}
