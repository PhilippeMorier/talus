import { Injectable } from '@angular/core';
import { intToRgba } from '@talus/model';
import {
  add,
  areEqual,
  Coord,
  createMaxCoord,
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
  grid = new Grid(-1);
  accessor = this.grid.getAccessor();

  initialize(): void {
    this.grid = new Grid(-1);
    this.accessor = this.grid.getAccessor();
  }

  get background(): number {
    return this.grid.background;
  }

  getVoxel(xyz: Coord): number {
    return this.accessor.getValue(xyz);
  }

  /**
   * Sets a new voxel via accessor to share access path.
   * @returns origin of `InternalNode1` of affected node (node containing added voxel).
   */
  setVoxel(xyz: Coord, newValue: number): VoxelChange {
    const oldValue = this.accessor.getValue(xyz);

    newValue !== this.grid.background
      ? this.accessor.setValueOn(xyz, newValue)
      : this.accessor.setValueOff(xyz, newValue);

    const internalNode1 = this.accessor.probeInternalNode1(xyz);
    const affectedNodeOrigin: Coord = internalNode1 ? internalNode1.origin : createMaxCoord();

    return {
      affectedNodeOrigin,
      newValue,
      oldValue,
      xyz,
    };
  }

  setVoxels(coords: Coord[], newValues: number[]): VoxelChange[] {
    if (coords.length !== newValues.length) {
      throw new Error(`Coordinates and new values don't have the same length.`);
    }

    const changes: VoxelChange[] = [];
    coords.forEach((xyz, i) => changes.push(this.setVoxel(xyz, newValues[i])));

    return changes;
  }

  removeVoxel(xyz: Coord): VoxelChange {
    const oldValue = this.accessor.getValue(xyz);

    this.accessor.setValueOff(xyz, this.grid.background);

    const internalNode1 = this.accessor.probeInternalNode1(xyz);
    const affectedNodeOrigin: Coord = internalNode1 ? internalNode1.origin : createMaxCoord();

    return {
      affectedNodeOrigin,
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
    const startCenter = add(start, { x: 0.5, y: 0.5, z: 0.5 });
    const end = points[1];
    const endCenter = add(end, { x: 0.5, y: 0.5, z: 0.5 });

    // Set end to ensure leaf-node is created in the grid. And has at least one active voxel.
    // Otherwise, it could happen that the end point is in a new leaf which doesn't yet exist
    // and therefore doesn't cause any intersection (since a ray intersects only with active
    // values i.e. either active voxels or tiles. The start voxel is already added when the
    // drawing of the line starts (in effect).
    const tempChange = this.setVoxel(end, newValue);

    const ray = createIntersectionRay(startCenter, endCenter);

    const totalTimeSpan = TimeSpan.inf();
    if (!this.findTotalTimeSpan(ray, totalTimeSpan)) {
      return [];
    }

    // Restore old value
    tempChange.oldValue === this.grid.background
      ? this.removeVoxel(tempChange.xyz)
      : this.setVoxel(tempChange.xyz, tempChange.oldValue);

    return this.setVoxelsAlongRayUntilLastVoxel(ray, totalTimeSpan, end, newValue);
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
    const dda = new DDA(Voxel.LOG2DIM);
    dda.init(ray, timeSpan.t0, timeSpan.t1);

    const coords: Coord[] = [];
    const values: number[] = [];

    do {
      const voxelCoord = dda.getVoxel();
      coords.push(voxelCoord);
      values.push(newValue);

      if (areEqual(lastVoxel, voxelCoord)) {
        break;
      }
    } while (dda.nextStep());

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

function createIntersectionRay(startXyz: Coord, endXyz: Coord): Ray {
  const eye = new Vec3(startXyz.x, startXyz.y, startXyz.z);
  const direction = new Vec3(endXyz.x - startXyz.x, endXyz.y - startXyz.y, endXyz.z - startXyz.z);

  return new Ray(eye, direction);
}

export interface VoxelChange {
  affectedNodeOrigin: Coord;
  newValue: number;
  oldValue: number;
  xyz: Coord;
}
