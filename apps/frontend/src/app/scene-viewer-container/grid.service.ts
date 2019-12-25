import { Injectable } from '@angular/core';
import { Coord, Grid, gridToMesh, MeshData } from '@talus/vdb';

/**
 * Keeps the mutable state of the single grid. This state is not part of the store, due to
 * the possible big size of the grid. Creating a new copy for the next state is impracticable.
 *
 * Supports editing the grid.
 */
@Injectable()
export class GridService {
  grid = new Grid(0);
  accessor = this.grid.getAccessor();

  addVoxel(xyz: Coord, value: number): void {
    this.accessor.setValue(xyz, value);
  }

  addVoxels(coords: Coord[], values: number[]): void {
    if (coords.length !== values.length) {
      coords.forEach(xyz => this.accessor.setValue(xyz, values[0]));
    } else {
      coords.forEach((xyz, i) => this.accessor.setValue(xyz, values[i]));
    }
  }

  removeVoxel(xyz: Coord): void {
    this.accessor.setValueOff(xyz, this.grid.background);
  }

  computeMesh(): MeshData | undefined {
    return gridToMesh(this.grid);
  }
}
