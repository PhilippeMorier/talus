import { Injectable } from '@angular/core';
import { Coord, Grid, MeshData, nodeToMesh } from '@talus/vdb';

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

  /**
   * Adds a new voxel via accessor to share access path.
   * @returns origin of `InternalNode1` of affected node (node containing added voxel).
   */
  addVoxel(xyz: Coord, value: number): Coord {
    this.accessor.setValue(xyz, value);

    return this.accessor.internalNode1Origin;
  }

  addVoxels(coords: Coord[], values: number[]): Coord[] {
    const affectedOrigins = new Map<string, Coord>();

    if (coords.length !== values.length) {
      coords.forEach(xyz => {
        const affected = this.addVoxel(xyz, values[0]);
        affectedOrigins.set(affected.toString(), affected);
      });
    } else {
      coords.forEach((xyz, i) => {
        const affected = this.addVoxel(xyz, values[i]);
        affectedOrigins.set(affected.toString(), affected);
      });
    }

    return Array.from(affectedOrigins.values());
  }

  removeVoxel(xyz: Coord): Coord {
    this.accessor.setActiveState(xyz, false);

    return this.accessor.internalNode1Origin;
  }

  computeInternalNode1Mesh(origin: Coord): MeshData | undefined {
    const internal1 = this.accessor.probeInternalNode1(origin);

    if (!internal1) {
      return undefined;
    }

    return nodeToMesh(internal1);
  }
}
