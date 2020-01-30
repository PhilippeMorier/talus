import { Coord, CoordBBox } from '../math';
import { InternalNode1 } from './internal-node';
import { LeafNode } from './leaf-node';
import { ValueAccessor3 } from './value-accessor';
import { Voxel } from './voxel';

export interface IterableNode<T> {
  /**
   * Iterator for visiting all active voxels. I.e. only values from `LeafNode`'s are yielded
   * and no values from tiles.
   */
  beginVoxelOn(): IterableIterator<Voxel<T>>;

  beginValueOn(): IterableIterator<ChildNode<T>>;
}

export interface Node<T> extends IterableNode<T> {
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

  /**
   * @brief Expand the specified bounding box so that it includes the active tiles
   * of this internal node as well as all the active values in its child nodes.
   * If visitVoxels is false LeafNodes will be approximated as dense, i.e. with all
   * voxels active. Else the individual active voxels are visited to produce a tight bbox.
   */
  evalActiveBoundingBox(bbox: CoordBBox, visitVoxels: boolean): void;

  getNodeBoundingBox(): CoordBBox;
}

export interface ChildNode<T> extends Node<T> {
  /**
   * Return the grid index coordinates of this node's local origin.
   */
  origin: Coord;
}

export interface HashableNode<T> extends Node<T> {
  /**
   * Return the value of the voxel at the given coordinates and, if necessary, update
   * the accessor with pointers to the nodes along the path from the root node to
   * the node containing the voxel.
   * @note Used internally by ValueAccessor.
   */
  getValueAndCache(xyz: Coord, accessor: ValueAccessor3<T>): T;

  /**
   * Same as probeNode() except, if necessary, update the accessor with pointers
   * to the nodes along the path from the root node to the node containing (x, y, z).
   * @note Used internally by ValueAccessor.
   */
  probeLeafNodeAndCache(xyz: Coord, accessor: ValueAccessor3<T>): LeafNode<T> | undefined;
  probeInternalNode1AndCache(xyz: Coord, accessor: ValueAccessor3<T>): InternalNode1<T> | undefined;

  /**
   * Change the value of the voxel at the given coordinates and mark it as active.
   * If necessary, update the accessor with pointers to the nodes along the path
   * from the root node to the node containing the voxel.
   * @note Used internally by ValueAccessor.
   * @return The affected `LeafNode` in which a value was set.
   */
  setValueAndCache(xyz: Coord, value: T, accessor: ValueAccessor3<T>): void;

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

  /**
   * Set the active state of the voxel at the given coordinates without changing its value.
   * If necessary, update the accessor with pointers to the nodes along the path
   * from the root node to the node containing the voxel.
   * @note Used internally by ValueAccessor.
   */
  setActiveStateAndCache(xyz: Coord, on: boolean, accessor: ValueAccessor3<T>): void;
}
