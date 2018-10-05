import { isPowerOfTwo3, mul3, Vector3 } from './vector3';
import { Voxel } from './world';

export class Chunk {
  voxels: Voxel[][][] = [];
  position: Vector3;

  constructor(readonly size: Vector3, readonly index: Vector3) {
    if (!isPowerOfTwo3(size)) {
      throw new Error('The number of voxels needs to be a power of two.');
    }

    this.position = mul3(size, index);
    this.initialize();
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
