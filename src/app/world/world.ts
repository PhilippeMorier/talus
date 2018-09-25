import { Chunk } from './chunk';
import { isPowerOfTwo3, Vector3, X, Y, Z } from './vector3';

export interface VoxelResult {
  voxel: Voxel;
  index: Vector3;
}

export class Voxel {
  constructor(public objectId: number, public type: number) {}
}

export interface Index {
  chunk: Vector3;
  voxel: Vector3;
}

export class World {
  chunks: Chunk[][][];

  constructor(readonly size: Vector3, readonly chunkSize: Vector3) {
    if (!isPowerOfTwo3(size)) {
      throw new Error('The number of chunks needs to be a power of two.');
    }

    if (!isPowerOfTwo3(chunkSize)) {
      throw new Error('The chunk size needs to be a power of two.');
    }

    // use push() to avoid HOLES and keep array PACKED (elements type)
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

  // *iterate(
  //   [minX, minY, minZ]: Vector3,
  //   [maxX, maxY, maxZ]: Vector3,
  // ): IterableIterator<VoxelResult> {
  //   for (let x = minX; x <= maxX; x++) {
  //     for (let y = minY; y <= maxY; y++) {
  //       for (let z = minZ; z <= maxZ; z++) {
  //         const voxel = this.getVoxel([x, y, z]);
  //         if (voxel) {
  //           yield { index: [x, y, z], voxel: voxel };
  //         }
  //       }
  //     }
  //   }
  // }

  getVoxelByAbsolutePosition(position: Vector3): Voxel | undefined {
    return this.getVoxel(this.calcPosition(position));
  }

  getVoxel(position: Index): Voxel | undefined {
    const chunk = this.chunks[position.chunk[X]][position.chunk[Y]][position.chunk[Z]];
    if (!chunk) {
      return undefined;
    }

    return chunk.voxels[position.voxel[0]][position.voxel[1]][position.voxel[2]];
  }

  setVoxelByAbsolutePosition(position: Vector3, voxel: Voxel): void {
    this.setVoxel(this.calcPosition(position), voxel);
  }

  setVoxel(index: Index, voxel: Voxel): void {
    const chunk = this.chunks[index.chunk[X]][index.chunk[Y]][index.chunk[Z]];
    if (!chunk) {
      this.chunks[index.chunk[X]][index.chunk[Y]][index.chunk[Z]] = new Chunk(
        this.chunkSize,
        index.chunk,
      );
    }

    this.chunks[index.chunk[X]][index.chunk[Y]][index.chunk[Z]].voxels[index.voxel[X]][
      index.voxel[Y]
    ][index.voxel[Z]] = voxel;
  }

  private calcPosition([x, y, z]: Vector3): Index {
    // Integer division ('>> 0' removes the decimals)
    const chunk: Vector3 = [
      (x / this.chunkSize[X]) >> 0,
      (y / this.chunkSize[Y]) >> 0,
      (z / this.chunkSize[Z]) >> 0,
    ];
    const voxel: Vector3 = [x % this.chunkSize[X], y % this.chunkSize[Y], z % this.chunkSize[Z]];

    return { chunk, voxel };
  }
}
