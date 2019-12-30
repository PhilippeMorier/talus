import { InternalNode1 } from '@talus/vdb';
import { Coord } from '../math/coord';
import { LeafNode } from './leaf-node';
import { ValueAccessor3 } from './value-accessor';
import { Voxel } from './voxel';

export interface Node<T> extends IterableNode<T> {
  /**
   * Set the value of the voxel at the given coordinates and mark the voxel as active.
   */
  setValueOn(xyz: Coord, value: T): LeafNode<T>;

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

  getLeafNodeAndCache(xyz: Coord, accessor: ValueAccessor3<T>): LeafNode<T> | undefined;

  getInternalNode1AndCache(xyz: Coord, accessor: ValueAccessor3<T>): InternalNode1<T> | undefined;

  /**
   * Change the value of the voxel at the given coordinates and mark it as active.
   * If necessary, update the accessor with pointers to the nodes along the path
   * from the root node to the node containing the voxel.
   * @note Used internally by ValueAccessor.
   * @return The affected `LeafNode` in which a value was set.
   */
  setValueAndCache(xyz: Coord, value: T, accessor: ValueAccessor3<T>): LeafNode<T>;

  /**
   * Change the value of the voxel at the given coordinates and mark it as inactive.
   * If necessary, update the accessor with pointers to the nodes along the path
   * from the root node to the node containing the voxel.
   * @note Used internally by ValueAccessor.
   */
  setValueOffAndCache(xyz: Coord, value: T, accessor: ValueAccessor3<T>): void;

  /**
   * Return `true` if the voxel at the given coordinates is active and, if necessary,
   * update the accessor with pointers to the nodes along the path from the root node
   * to the node containing the voxel.
   * @note Used internally by ValueAccessor.
   */
  isValueOnAndCache(xyz: Coord, accessor: ValueAccessor3<T>): boolean;
}

export interface IterableNode<T> {
  /**
   * Iterator for visiting all active voxels. I.e. only values from `LeafNode`'s are yielded
   * and no values from tiles.
   */
  beginVoxelOn(): IterableIterator<Voxel<T>>;

  /**
   * Iterator for getting all `LeafNode`'s.
   */
  beginLeafOn(): IterableIterator<LeafNode<T>>;
}
