import { Chunk } from './chunk';
import { isPowerOfTwo3, Vector3, X, Y, Z } from './vector3';
import { Voxel } from './voxel';

export class World {
  chunks: Chunk[][][];

  constructor(readonly size: Vector3, readonly chunkSize: Vector3) {
    if (!isPowerOfTwo3(size)) {
      throw new Error('The number of chunks needs to be a power of two.');
    }

    if (!isPowerOfTwo3(chunkSize)) {
      throw new Error('The chunk size needs to be a power of two.');
    }

    // use push() to avoid HOLES and keep array PACKED (elements kind)
    this.chunks = [];
    for (let x = 0; x < size[X]; x++) {
      this.chunks.push([]);
      for (let y = 0; y < size[Y]; y++) {
        this.chunks[x].push([]);
        for (let z = 0; z < size[Z]; z++) {
          this.chunks[x][y].push(undefined);
        }
      }
    }
  }

  getVoxel({ chunk: c, voxel: v }: Index): Voxel | undefined {
    const chunk = this.chunks[c[X]][c[Y]][c[Z]];

    if (!chunk) {
      return undefined;
    }

    return chunk.getVoxel([v[X], v[Y], v[Z]]);
  }

  setVoxel({ chunk: c, voxel: v }: Index, voxel: Voxel): Chunk {
    let chunk = this.chunks[c[X]][c[Y]][c[Z]];

    if (!chunk) {
      chunk = new Chunk(this.chunkSize, c);
      this.chunks[c[X]][c[Y]][c[Z]] = chunk;
    }

    chunk.setVoxel([v[X], v[Y], v[Z]], voxel);

    return chunk;
  }

  setVoxelByAbsolutePosition(position: Vector3, voxel: Voxel): void {
    this.setVoxel(this.calcPosition(position), voxel);
  }

  getVoxelByAbsolutePosition(position: Vector3): Voxel | undefined {
    return this.getVoxel(this.calcPosition(position));
  }

  private calcPosition([x, y, z]: Vector3): Index {
    // Integer division ('>> 0' removes the decimals)
    const chunk: Vector3 = [
      // tslint:disable:no-bitwise
      (x / this.chunkSize[X]) >> 0,
      (y / this.chunkSize[Y]) >> 0,
      (z / this.chunkSize[Z]) >> 0,
      // tslint:enable:no-bitwise
    ];
    const voxel: Vector3 = [x % this.chunkSize[X], y % this.chunkSize[Y], z % this.chunkSize[Z]];

    return { chunk, voxel };
  }
}

export interface Index {
  chunk: Vector3;
  voxel: Vector3;
}
