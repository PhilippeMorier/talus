import { Coord, CoordBBox } from '../math';
import { Index } from '../types';
import { NodeMask } from '../util/node-mask';
import { InternalNode1 } from './internal-node';
import { LeafBuffer } from './leaf-buffer';
import { ChildNode, HashableNode } from './node';
import { ValueAccessor3 } from './value-accessor';
import { Voxel } from './voxel';

export class LeafNode<T> implements HashableNode<T> {
  // tslint:disable:no-bitwise
  static readonly LOG2DIM: Index = 3; // needed by parent nodes
  static readonly TOTAL: Index = LeafNode.LOG2DIM; // needed by parent nodes
  static readonly DIM: Index = 1 << LeafNode.TOTAL; // dimension along one coordinate direction
  static readonly DIM_MAX_INDEX: Index = LeafNode.DIM - 1; // @performance
  static readonly DIM_MAX_INDEX_INVERTED: Index = ~(LeafNode.DIM - 1); // @performance
  static readonly NUM_VALUES: Index = 1 << (3 * LeafNode.LOG2DIM);
  static readonly NUM_VOXELS: Index = LeafNode.NUM_VALUES; // total number of voxels represented by this node
  static readonly SIZE: Index = LeafNode.NUM_VALUES;
  static readonly LEVEL: Index = 0; // level 0 = leaf
  // tslint:enable:no-bitwise

  // Global grid index coordinates (x,y,z) of the local origin of this node
  readonly origin: Coord;

  // Buffer containing the actual data values
  private buffer: LeafBuffer<T>;
  // Bitmask that determines which voxels are active
  private valueMask: NodeMask;

  /**
   * Return the linear table offset of the given global or local coordinates.
   */
  static coordToOffset(xyz: Coord): Index {
    // tslint:disable:no-bitwise
    return (
      ((xyz.x & LeafNode.DIM_MAX_INDEX) << (2 * LeafNode.LOG2DIM)) +
      ((xyz.y & LeafNode.DIM_MAX_INDEX) << LeafNode.LOG2DIM) +
      (xyz.z & LeafNode.DIM_MAX_INDEX)
    );
    // tslint:enable:no-bitwise
  }

  /**
   * Return the local coordinates for a linear table offset,
   * where offset 0 has coordinates (0, 0, 0).
   */
  static offsetToLocalCoord(i: Index): Coord {
    const xyz: Coord = { x: 0, y: 0, z: 0 };

    // tslint:disable:no-bitwise
    xyz.x = i >> (2 * LeafNode.LOG2DIM);
    i &= (1 << (2 * LeafNode.LOG2DIM)) - 1;
    xyz.y = i >> LeafNode.LOG2DIM;
    xyz.z = i & ((1 << LeafNode.LOG2DIM) - 1);
    // tslint:enable:no-bitwise

    return xyz;
  }

  /**
   * @param origin - the grid index coordinates of a voxel
   * @param value - a value with which to fill the buffer
   * @param active - the active state to which to initialize all voxels
   */
  constructor(origin: Coord, value?: T, active: boolean = false) {
    this.buffer = new LeafBuffer<T>(LeafNode.NUM_VOXELS, value);
    this.valueMask = new NodeMask(LeafNode.NUM_VALUES, active);

    // tslint:disable:no-bitwise
    this.origin = {
      x: origin.x & LeafNode.DIM_MAX_INDEX_INVERTED,
      y: origin.y & LeafNode.DIM_MAX_INDEX_INVERTED,
      z: origin.z & LeafNode.DIM_MAX_INDEX_INVERTED,
    };
    // tslint:enable:no-bitwise
  }

  /**
   * Set the value of the voxel at the given coordinates and mark the voxel as active.
   */
  setValueOn(xyz: Coord, value: T): void {
    const offset = LeafNode.coordToOffset(xyz);

    this.buffer.setValue(offset, value);
    this.valueMask.setOn(offset);
  }

  /**
   * Set the value of the voxel at the given coordinates and mark the voxel as inactive.
   */
  setValueOff(xyz: Coord, value: T): void {
    const offset = LeafNode.coordToOffset(xyz);

    this.buffer.setValue(offset, value);
    this.valueMask.setOff(offset);
  }

  /**
   * Set the active state of the voxel at the given coordinates but don't change its value.
   */
  setActiveState(xyz: Coord, on: boolean): void {
    this.valueMask.set(LeafNode.coordToOffset(xyz), on);
  }

  /**
   * Return the value of the voxel at the given coordinates.
   */
  getValue(xyz: Coord): T {
    return this.buffer.getValue(LeafNode.coordToOffset(xyz));
  }

  isValueOn(xyz: Coord): boolean {
    return this.valueMask.isOn(LeafNode.coordToOffset(xyz));
  }

  onVoxelCount(): number {
    return this.valueMask.countOn();
  }

  /**
   * @brief Return the value of the voxel at the given coordinates.
   * @note Used internally by ValueAccessor.
   */
  getValueAndCache(xyz: Coord, _accessor: ValueAccessor3<T>): T {
    return this.getValue(xyz);
  }

  probeLeafNodeAndCache(_xyz: Coord, _accessor: ValueAccessor3<T>): LeafNode<T> | undefined {
    return this;
  }

  touchLeafAndCache(_xyz: Coord, _accessor: ValueAccessor3<T>): LeafNode<T> {
    return this;
  }

  probeInternalNode1AndCache(
    _xyz: Coord,
    _accessor: ValueAccessor3<T>,
  ): InternalNode1<T> | undefined {
    throw new Error(`Shouldn't be called on LeafNode`);
  }

  /**
   * @brief Change the value of the voxel at the given coordinates and mark it as active.
   * @note Used internally by ValueAccessor.
   */
  setValueAndCache(xyz: Coord, value: T, _accessor: ValueAccessor3<T>): void {
    this.setValueOn(xyz, value);
  }

  /**
   * @brief Change the value of the voxel at the given coordinates and mark it as inactive.
   * @note Used internally by ValueAccessor.
   */
  setValueOffAndCache(xyz: Coord, value: T, _accessor: ValueAccessor3<T>): void {
    this.setValueOff(xyz, value);
  }

  /**
   * @brief Return `true` if the voxel at the given coordinates is active.
   * @note Used internally by ValueAccessor.
   */
  isValueOnAndCache(xyz: Coord, _accessor: ValueAccessor3<T>): boolean {
    return this.isValueOn(xyz);
  }

  /**
   * @brief Set the active state of the voxel at the given coordinates without changing its value.
   * @note Used internally by ValueAccessor.
   */
  setActiveStateAndCache(xyz: Coord, on: boolean, _accessor: ValueAccessor3<T>): void {
    return this.setActiveState(xyz, on);
  }

  /**
   * Return the global coordinates for a linear table offset.
   */
  offsetToGlobalCoord(i: Index): Coord {
    const localCoord = LeafNode.offsetToLocalCoord(i);

    return {
      x: localCoord.x + this.origin.x,
      y: localCoord.y + this.origin.y,
      z: localCoord.z + this.origin.z,
    };
  }

  /**
   * Expand the given bounding box so that it includes this leaf node's active voxels.
   * If visitVoxels is false this LeafNode will be approximated as dense, i.e. with all
   * voxels active. Else the individual active voxels are visited to produce a tight bbox.
   */
  evalActiveBoundingBox(bbox: CoordBBox, visitVoxels: boolean = true): void {
    const thisBbox = this.getNodeBoundingBox();

    // this LeafNode is already enclosed in the bbox
    if (bbox.isInside(thisBbox)) {
      return;
    }

    // any active values?
    if (!this.beginVoxelOn().next().done) {
      // use voxel granularity?
      if (visitVoxels) {
        thisBbox.reset();
        // Originally, `beginValueOn()` would be called
        for (const voxel of this.beginVoxelOn()) {
          thisBbox.expand(voxel.globalCoord);
        }
        thisBbox.translate(this.origin);
      }

      bbox.expand(thisBbox);
    }
  }

  /**
   * Return the bounding box of this node, i.e., the full index space
   * spanned by this leaf node.
   */
  getNodeBoundingBox(): CoordBBox {
    return CoordBBox.createCube(this.origin, LeafNode.DIM);
  }

  *beginVoxelOn(): IterableIterator<Voxel<T>> {
    for (const index of this.valueMask.beginOn()) {
      yield new Voxel(this.offsetToGlobalCoord(index), this.buffer.getValue(index));
    }
  }

  beginValueOn(): IterableIterator<ChildNode<T>> {
    // In `evalActiveBoundingBox()` `beginVoxelOn()` is called instead of `beginValueOn()`
    // to have `globalCoord` available.
    throw new Error(`Shouldn't be called on LeafNode`);
  }
}
