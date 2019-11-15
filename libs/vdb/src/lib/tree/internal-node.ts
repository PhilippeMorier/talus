import { Coord, X, Y, Z } from '../math/coord';
import { NodeMask } from '../util/node-mask';
import { Index, LeafNode, ValueType } from './leaf-node';
import { NodeUnion } from './node-union';

import { createDenseArray } from '../util/array';

type ChildNodeType<T extends ValueType> = InternalNode<T> | LeafNode<T>;

export class InternalNode<T extends ValueType> {
  // tslint:disable:no-bitwise
  static readonly LOG2DIM = 4; // log2 of tile count in one dimension
  static readonly TOTAL = InternalNode.LOG2DIM + LeafNode.TOTAL; // log2 of voxel count in one dimension
  static readonly DIM = 1 << InternalNode.TOTAL; // total voxel count in one dimension
  static readonly NUM_VALUES = 1 << (3 * InternalNode.LOG2DIM); // total child count represented by this node
  static readonly LEVEL = 1 + LeafNode.LEVEL; // level 0 = leaf
  static readonly NUM_VOXELS = 1 << (3 * InternalNode.TOTAL); // total voxel count represented by this node
  // tslint:enable:no-bitwise

  private childMask = new NodeMask(InternalNode.NUM_VALUES);
  private valueMask = new NodeMask(InternalNode.NUM_VALUES);

  private nodes = createDenseArray(
    InternalNode.NUM_VALUES,
    () => new NodeUnion<T, ChildNodeType<T>>(),
  );

  /**
   * Set the value of the voxel at the given coordinates and mark the voxel as active.
   */
  setValueOn(xyz: Coord, value: T): void {
    const i: Index = this.coordToOffset(xyz);
    const node = this.nodes[i];
    let hasChild = this.childMask.isOn(i);

    if (!hasChild) {
      const active = this.valueMask.isOn(i); // tile's active state

      if (!active || node.getValue() !== value) {
        // If the voxel belongs to a tile that is either inactive or that
        // has a constant value that is different from the one provided,
        // a child subtree must be constructed.
        hasChild = true;
        this.setChildNode(i, new LeafNode<T>(xyz, node.getValue(), active)); // TODO: s/LeafNode/ChildNode
      }
    }

    if (hasChild) {
      node.getChild().setValueOn(xyz, value);
    }
  }

  getValue(xyz: Coord): T {
    const i: Index = this.coordToOffset(xyz);

    return this.childMask.isOff(i)
      ? this.nodes[i].getValue()
      : this.nodes[i].getChild().getValue(xyz);
  }

  isValueOn(xyz: Coord): boolean {
    const i: Index = this.coordToOffset(xyz);
    if (this.childMask.isOff(i)) {
      return this.valueMask.isOn(i);
    }

    return this.nodes[i].getChild().isValueOn(xyz);
  }

  coordToOffset(xyz: Coord): Index {
    // tslint:disable:no-bitwise
    return (
      (((xyz[X] & (InternalNode.DIM - 1)) >> LeafNode.TOTAL) << (2 * InternalNode.LOG2DIM)) +
      (((xyz[Y] & (InternalNode.DIM - 1)) >> LeafNode.TOTAL) << InternalNode.LOG2DIM) +
      ((xyz[Z] & (InternalNode.DIM - 1)) >> LeafNode.TOTAL)
    );
    // tslint:enable:no-bitwise
  }

  private setChildNode(i: Index, child: LeafNode<T>): void {
    if (this.childMask.isOn(i)) {
      throw new Error('Child is already on.');
    }

    this.childMask.setOn(i);
    this.valueMask.setOff(i);
    this.nodes[i].setChild(child);
  }

  private getChildNode(i: Index): InternalNode<T> | LeafNode<T> {
    if (this.childMask.isOff(i)) {
      throw new Error('Child is off.');
    }

    return this.nodes[i].getChild();
  }
}
