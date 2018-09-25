import { mul3, Vector3 } from './vector3';
import { Voxel } from './world';

export class Chunk {
  voxels: Voxel[][][];
  position: Vector3;

  constructor(readonly size: Vector3, readonly index: Vector3) {
    this.position = mul3(size, index);
    this.initialize();
  }

  private initialize(): void {
    this.voxels = new Array(this.size[0]);
    for (let x = 0; x < this.size[0]; x++) {
      this.voxels[x] = new Array(this.size[1]);
      for (let y = 0; y < this.size[1]; y++) {
        this.voxels[x][y] = new Array(this.size[2]);
      }
    }
  }
}
