import { Injectable } from '@angular/core';
import { intToRgba } from '@talus/model';
import {
  add,
  areEqual,
  Coord,
  DDA,
  Grid,
  MeshData,
  nodeToMesh,
  Ray,
  TimeSpan,
  Vec3,
  VolumeRayIntersector,
  Voxel,
} from '@talus/vdb';

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

  private readonly dda = new DDA(Voxel.LOG2DIM);
  private readonly alphaFactor = 1 / 255;

  /**
   * Sets a new voxel via accessor to share access path.
   * @returns origin of `InternalNode1` of affected node (node containing added voxel).
   */
  setVoxel(xyz: Coord, newValue: number): VoxelChange {
    const oldValue = this.accessor.getValue(xyz);

    this.accessor.setValueOn(xyz, newValue);

    return {
      affectedNodeOrigin: this.accessor.internalNode1Origin,
      newValue,
      oldValue,
      xyz,
    };
  }

  setVoxels(coords: Coord[], newValues: number[]): VoxelChange[] {
    const changes = new Map<string, VoxelChange>();

    if (coords.length !== newValues.length) {
      throw new Error(`Coordinates and new values don't have the same length.`);
    }

    coords.forEach((xyz, i) => {
      const change = this.setVoxel(xyz, newValues[i]);
      changes.set(change.affectedNodeOrigin.toString(), change);
    });

    return Array.from(changes.values());
  }

  removeVoxel(xyz: Coord): VoxelChange {
    const oldValue = this.accessor.getValue(xyz);

    this.accessor.setActiveState(xyz, false);

    return {
      affectedNodeOrigin: this.accessor.internalNode1Origin,
      oldValue,
      newValue: oldValue,
      xyz,
    };
  }

  paintVoxel(xyz: Coord, newValue: number): VoxelChange {
    return this.setVoxel(xyz, newValue);
  }

  selectLine(points: Coord[], newValue: number): VoxelChange[] {
    const start = points[0];
    const startCenter = add(start, [0.5, 0.5, 0.5]);
    const end = points[1];
    const endCenter = add(end, [0.5, 0.5, 0.5]);

    // Set start & end to ensure leaf-nodes are created in the grid.
    // Otherwise, it could happen that the start/end point is in a new leaf which
    // doesn't yet exist and therefore doesn't cause any intersection.
    this.setVoxels(points, [newValue, newValue]);

    const eye = new Vec3(startCenter[0], startCenter[1], startCenter[2]);
    const direction = new Vec3(
      endCenter[0] - startCenter[0],
      endCenter[1] - startCenter[1],
      endCenter[2] - startCenter[2],
    );
    const ray = new Ray(eye, direction);

    const intersector = new VolumeRayIntersector(this.grid);
    const coords: Coord[] = [];
    const values: number[] = [];

    // Does ray intersect
    if (!intersector.setIndexRay(ray)) {
      return [];
    }

    const totalTimeSpan = TimeSpan.inf();
    if (!intersector.marchUntilEnd(totalTimeSpan)) {
      return [];
    }

    this.dda.init(ray, totalTimeSpan.t0, totalTimeSpan.t1);

    do {
      const voxelCoord = this.dda.getVoxel();
      coords.push(voxelCoord);
      values.push(newValue);

      if (areEqual(end, voxelCoord)) {
        break;
      }
    } while (this.dda.nextStep());

    return this.setVoxels(coords, values);
  }

  computeInternalNode1Mesh(origin: Coord): MeshData | undefined {
    const internal1 = this.accessor.probeInternalNode1(origin);

    if (!internal1) {
      return undefined;
    }

    return nodeToMesh(internal1, this.valueToColor);
  }

  private valueToColor = (value: number): [number, number, number, number] => {
    const rgba = intToRgba(value);

    return [
      rgba.r * this.alphaFactor,
      rgba.g * this.alphaFactor,
      rgba.b * this.alphaFactor,
      rgba.a * this.alphaFactor,
    ];
  };
}

export interface VoxelChange {
  affectedNodeOrigin: Coord;
  newValue: number;
  oldValue: number;
  xyz: Coord;
}
