import { Coord } from '../math/coord';
import { NodeMask } from '../util/node-mask';
import { LeafBuffer } from './leaf-buffer';

export type ValueType = boolean | number | string;
export type Index = number;

export class LeafNode<T extends ValueType> {
  // tslint:disable:no-bitwise
  static readonly LOG2DIM: Index = 3; // needed by parent nodes
  static readonly TOTAL: Index = LeafNode.LOG2DIM; // needed by parent nodes
  static readonly DIM: Index = 1 << LeafNode.TOTAL; // dimension along one coordinate direction
  static readonly NUM_VALUES: Index = 1 << (3 * LeafNode.LOG2DIM);
  static readonly NUM_VOXELS: Index = LeafNode.NUM_VALUES; // total number of voxels represented by this node
  static readonly SIZE: Index = LeafNode.NUM_VALUES;
  static readonly LEVEL: Index = 0; // level 0 = leaf
  // tslint:enable:no-bitwise

  // Buffer containing the actual data values
  private buffer = new LeafBuffer<T>();
  // Bitmask that determines which voxels are active
  private valueMask = new NodeMask();
  // Global grid index coordinates (x,y,z) of the local origin of this node
  private origin: Coord;

  static coordToOffset(xyz: Coord): Index {
    // tslint:disable:no-bitwise
    return (
      ((xyz[0] & (LeafNode.DIM - 1)) << (2 * LeafNode.LOG2DIM)) +
      ((xyz[1] & (LeafNode.DIM - 1)) << LeafNode.LOG2DIM) +
      (xyz[2] & (LeafNode.DIM - 1))
    );
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
   * Return the value of the voxel at the given coordinates.
   */
  getValue(xyz: Coord): T {
    return this.buffer.getValue(LeafNode.coordToOffset(xyz));
  }
}
