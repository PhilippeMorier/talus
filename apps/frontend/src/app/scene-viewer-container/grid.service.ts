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

const COLOR_FACTOR = 1 / 255;

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

  computeInternalNode1Mesh(origin: Coord): MeshData | undefined {
    const internal1 = this.accessor.probeInternalNode1(origin);

    if (!internal1) {
      return undefined;
    }

    return nodeToMesh(internal1, this.valueToColor);
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

    const ray = this.createIntersectionRay(startCenter, endCenter);

    const totalTimeSpan = TimeSpan.inf();
    if (!this.findTotalTimeSpan(ray, totalTimeSpan)) {
      return [];
    }

    return this.setVoxelsAlongRayUntilLastVoxel(ray, totalTimeSpan, end, newValue);
  }

  private createIntersectionRay(startXyz: Coord, endXyz: Coord): Ray {
    const eye = new Vec3(startXyz[0], startXyz[1], startXyz[2]);
    const direction = new Vec3(
      endXyz[0] - startXyz[0],
      endXyz[1] - startXyz[1],
      endXyz[2] - startXyz[2],
    );

    return new Ray(eye, direction);
  }

  private findTotalTimeSpan(ray: Ray, timeSpanRef: TimeSpan): boolean {
    const intersector = new VolumeRayIntersector(this.grid);

    // Does ray intersect
    if (!intersector.setIndexRay(ray)) {
      return false;
    }

    return intersector.marchUntilEnd(timeSpanRef);
  }

  private setVoxelsAlongRayUntilLastVoxel(
    ray: Ray,
    timeSpan: TimeSpan,
    lastVoxel: Coord,
    newValue: number,
  ): VoxelChange[] {
    this.dda.init(ray, timeSpan.t0, timeSpan.t1);

    const coords: Coord[] = [];
    const values: number[] = [];

    do {
      const voxelCoord = this.dda.getVoxel();
      coords.push(voxelCoord);
      values.push(newValue);

      if (areEqual(lastVoxel, voxelCoord)) {
        break;
      }
    } while (this.dda.nextStep());

    return this.setVoxels(coords, values);
  }

  private valueToColor = (value: number): [number, number, number, number] => {
    const rgba = intToRgba(value);

    return [
      rgba.r * COLOR_FACTOR,
      rgba.g * COLOR_FACTOR,
      rgba.b * COLOR_FACTOR,
      rgba.a * COLOR_FACTOR,
    ];
  };
}

export interface VoxelChange {
  affectedNodeOrigin: Coord;
  newValue: number;
  oldValue: number;
  xyz: Coord;
}
