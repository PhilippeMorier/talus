import { isPowerOfTwo3, mul3, Vector3 } from './vector3';
import { toVoxel, toVoxelValue, Voxel } from './voxel';

export class Chunk {
  position: Vector3;
  private voxels: number[][][] = [];

  constructor(readonly size: Vector3, readonly index: Vector3) {
    if (!isPowerOfTwo3(size)) {
      throw new Error('The number of voxels needs to be a power of two.');
    }

    this.position = mul3(size, index);
    this.initialize();
  }

  get id(): string {
    return `chunk ${this.index}`;
  }

  setVoxel([x, y, z]: Vector3, voxel: Voxel): void {
    this.voxels[x][y][z] = toVoxelValue(voxel);
  }

  getVoxel([x, y, z]: Vector3): Voxel {
    return toVoxel(this.voxels[x][y][z]);
  }

  private initialize(): void {
    for (let x = 0; x < this.size[0]; x++) {
      this.voxels.push([]);
      for (let y = 0; y < this.size[1]; y++) {
        this.voxels[x].push([]);
        for (let z = 0; z < this.size[1]; z++) {
          this.voxels[x][y].push(undefined);
        }
      }
    }
  }
}
