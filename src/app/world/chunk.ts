import { Vector3 } from './vector3';
import { Voxel } from './world';

export class Chunk {
  public voxels: Voxel[][][];

  public constructor(private readonly size: Vector3) {
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
