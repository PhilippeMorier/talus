import { Coord } from '../math/coord';
import { NodeMask } from '../util/node-mask';
import { LeafBuffer } from './leaf-buffer';
import { HashableNode } from './node';
import { ValueAccessor3 } from './value-accessor';

export type ValueType = boolean | number | string;
export type Index = number;

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

  // Buffer containing the actual data values
  private buffer: LeafBuffer<T>;
  // Bitmask that determines which voxels are active
  private valueMask: NodeMask;
  // Global grid index coordinates (x,y,z) of the local origin of this node
  private origin: Coord;

  /**
   * Return the linear table offset of the given global or local coordinates.
   */
  static coordToOffset(xyz: Coord): Index {
    // tslint:disable:no-bitwise
    return (
      ((xyz[0] & LeafNode.DIM_MAX_INDEX) << (2 * LeafNode.LOG2DIM)) +
      ((xyz[1] & LeafNode.DIM_MAX_INDEX) << LeafNode.LOG2DIM) +
      (xyz[2] & LeafNode.DIM_MAX_INDEX)
    );
    // tslint:enable:no-bitwise
  }

  /**
   * Return the local coordinates for a linear table offset,
   * where offset 0 has coordinates (0, 0, 0).
   */
  static offsetToLocalCoord(i: Index): Coord {
    const xyz: Coord = [0, 0, 0];

    // tslint:disable:no-bitwise
    xyz[0] = i >> (2 * LeafNode.LOG2DIM);
    i &= (1 << (2 * LeafNode.LOG2DIM)) - 1;
    xyz[1] = i >> LeafNode.LOG2DIM;
    xyz[2] = i & ((1 << LeafNode.LOG2DIM) - 1);
    // tslint:enable:no-bitwise

    return xyz;
  }

  /**
   * @param xyz - the grid index coordinates of a voxel
   * @param value - a value with which to fill the buffer
   * @param active - the active state to which to initialize all voxels
   */
  constructor(xyz: Coord, value?: T, active: boolean = false) {
    this.buffer = new LeafBuffer<T>(LeafNode.NUM_VOXELS, value);
    this.valueMask = new NodeMask(LeafNode.NUM_VALUES, active);

    // tslint:disable:no-bitwise
    this.origin = [
      xyz[0] & LeafNode.DIM_MAX_INDEX_INVERTED,
      xyz[1] & LeafNode.DIM_MAX_INDEX_INVERTED,
      xyz[2] & LeafNode.DIM_MAX_INDEX_INVERTED,
    ];
    // tslint:enable:no-bitwise
  }

  setValueOn(xyz: Coord, value: T): void {
    const offset = LeafNode.coordToOffset(xyz);

    this.buffer.setValue(offset, value);
    this.valueMask.setOn(offset);
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
  getValueAndCache(xyz: Coord, _: ValueAccessor3<T>): T {
    return this.getValue(xyz);
  }

  /**
   * @brief Change the value of the voxel at the given coordinates and mark it as active.
   * @note Used internally by ValueAccessor.
   */
  setValueAndCache(xyz: Coord, value: T, _: ValueAccessor3<T>): void {
    this.setValueOn(xyz, value);
  }

  *beginVoxelOn(): IterableIterator<T> {
    for (const index of this.valueMask.beginOn()) {
      yield this.buffer.getValue(index);
    }
  }
}
