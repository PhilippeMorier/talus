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

  colors = {
    0: [0, 0, 0, 1],
    1: [0, 0, 1, 1],
    2: [0, 1, 0, 1],
    3: [0, 1, 1, 1],
    4: [1, 0, 0, 1],
    5: [1, 0, 1, 1],
    6: [1, 1, 0, 1],
    7: [1, 1, 1, 1],
  };

  /**
   * Sets a new voxel via accessor to share access path.
   * @returns origin of `InternalNode1` of affected node (node containing added voxel).
   */
  setVoxel(xyz: Coord, value: number): VoxelChange {
    this.accessor.setValueOn(xyz, value);

    return {
      affectedNodeOrigin: this.accessor.internalNode1Origin,
      value,
      position: xyz,
    };
  }

  setVoxels(coords: Coord[], values: number[]): VoxelChange[] {
    const changes = new Map<string, VoxelChange>();

    if (coords.length !== values.length) {
      throw new Error(`Coordinates and values don't have the same length.`);
    }

    coords.forEach((xyz, i) => {
      const change = this.setVoxel(xyz, values[i]);
      changes.set(change.affectedNodeOrigin.toString(), change);
    });

    return Array.from(changes.values());
  }

  removeVoxel(xyz: Coord): VoxelChange {
    this.accessor.setActiveState(xyz, false);

    return {
      affectedNodeOrigin: this.accessor.internalNode1Origin,
      value: this.accessor.getValue(xyz),
      position: xyz,
    };
  }

  paintVoxel(xyz: Coord): VoxelChange {
    const oldValue = this.accessor.getValue(xyz);

    this.setVoxel(xyz, 3);

    return {
      affectedNodeOrigin: this.accessor.internalNode1Origin,
      value: oldValue,
      position: xyz,
    };
  }

  computeInternalNode1Mesh(origin: Coord): MeshData | undefined {
    const internal1 = this.accessor.probeInternalNode1(origin);

    if (!internal1) {
      return undefined;
    }

    return nodeToMesh(internal1, this.valueToColor);
  }

  private valueToColor = (value: number): [number, number, number, number] => {
    return this.colors[value % 8];
  };
}

export interface VoxelChange {
  affectedNodeOrigin: Coord;
  value: number;
  position: Coord;
}
