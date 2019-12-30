import { Injectable } from '@angular/core';
import {
  Coord,
  getPathFromValueAccessor,
  Grid,
  gridToMesh,
  LeafNode,
  MeshData,
  ValueAccessorPath,
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

  addVoxel(xyz: Coord, value: number): ValueAccessorPath {
    this.accessor.setValue(xyz, value);

    return getPathFromValueAccessor(this.accessor);
  }

  addVoxels(coords: Coord[], values: number[]): ValueAccessorPath {
    const path = new ValueAccessorPath();

    if (coords.length !== values.length) {
      coords.forEach(xyz => path.add(this.addVoxel(xyz, values[0])));
    } else {
      coords.forEach((xyz, i) => path.add(this.addVoxel(xyz, values[i])));
    }

    return path;
  }

  removeVoxel(xyz: Coord): void {
    this.accessor.setValueOff(xyz, this.grid.background);
  }

  computeMesh(): MeshData | undefined {
    return gridToMesh(this.grid.beginVoxelOn());
  }

  computeLeafNodeMesh(origin: Coord): MeshData | undefined {
    const leaf = this.accessor.getLeafNode(origin);

    const mesh = gridToMesh(leaf.beginVoxelOn());
    mesh.origin = leaf.origin;

    return mesh;
  }

  computeInternalNode1Mesh(origin: Coord): MeshData | undefined {
    const internal1 = this.accessor.getInternalNode1(origin);

    const mesh = gridToMesh(internal1.beginVoxelOn());
    mesh.origin = internal1.origin;

    return mesh;
  }
}
