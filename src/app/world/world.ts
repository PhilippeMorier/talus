import { Vector3 } from './vector3';
import { Chunk } from './chunk';

export class Voxel {
  public constructor(public type: number) {}
}

interface Position {
  c: Vector3;
  v: Vector3;
}

export class World {
  private chunks: Chunk[][][] = [];

  public constructor(private readonly size: Vector3, private readonly chunkSize: Vector3) {
    this.chunks = new Array(this.size[0]);
    for (let x = 0; x < this.size[0]; x++) {
      this.chunks[x] = new Array(this.size[1]);
      for (let y = 0; y < this.size[1]; y++) {
        this.chunks[x][y] = [];
      }
    }
  }

  public getVoxel(position: Vector3): Voxel {
    const { c, v } = this.calcPosition(position);
    const chunk = this.chunks[c[0]][c[1]][c[2]];

    return chunk.voxels[v[0]][v[1]][v[2]];
  }

  public setVoxel(position: Vector3, voxel: Voxel): void {
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
