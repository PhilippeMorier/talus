import { Coord } from '../math/coord';

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
}
