import { Coord } from '../math/coord';
import { ValueAccessor3 } from './value-accessor';

export interface Node<T> {
  /**
   * Set the value of the voxel at the given coordinates and mark the voxel as active.
   */
  setValueOn(xyz: Coord, value: T): void;

  /**
   * Return the value of the voxel at the given coordinates.
   */
  getValue(xyz: Coord): T;

  /**
   * Return `true` if the voxel at the given coordinates is active.
   */
  isValueOn(xyz: Coord): boolean;

  /**
   * Return the number of active voxels.
   */
  onVoxelCount(): number;
}

export interface HashableNode<T> extends Node<T> {
  /**
   * Return the value of the voxel at the given coordinates and, if necessary, update
   * the accessor with pointers to the nodes along the path from the root node to
   * the node containing the voxel.
   * @note Used internally by ValueAccessor.
   */
  getValueAndCache(xyz: Coord, accessor: ValueAccessor3<T>): T;
}
