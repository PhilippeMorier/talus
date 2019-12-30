import { Injectable } from '@angular/core';
import { clone, Coord, Grid, gridToMesh, MeshData } from '@talus/vdb';

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

  addVoxel(xyz: Coord, value: number): Coord {
    this.accessor.setValue(xyz, value);

    return this.accessor.key;
  }

  addVoxels(coords: Coord[], values: number[]): Coord[] {
    const affectedOrigins = new Map<string, Coord>();

    if (coords.length !== values.length) {
      coords.forEach(xyz => {
        const affected = this.addVoxel(xyz, values[0]);
        affectedOrigins.set(affected.toString(), clone(affected));
      });
    } else {
      coords.forEach((xyz, i) => {
        const affected = this.addVoxel(xyz, values[i]);
        affectedOrigins.set(affected.toString(), clone(affected));
      });
    }

    return Array.from(affectedOrigins.values());
  }

  removeVoxel(xyz: Coord): Coord {
    this.accessor.setValueOff(xyz, this.grid.background);

    return this.accessor.key;
  }

  computeMesh(): MeshData | undefined {
    return gridToMesh(this.grid.beginVoxelOn());
  }

  computeInternalNode1Mesh(origin: Coord): MeshData | undefined {
    const internal1 = this.accessor.getInternalNode1(origin);

    const mesh = gridToMesh(internal1.beginVoxelOn());
    mesh.origin = internal1.origin;

    return mesh;
  }
}
