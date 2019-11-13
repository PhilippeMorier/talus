import { Coord } from '../math/coord';
import { NodeMask } from '../util/node-mask';
import { Index, LeafNode, ValueType } from './leaf-node';
import { NodeUnion } from './node-union';

type ChildNodeType<T extends ValueType> = InternalNode<T> | LeafNode<T>;

export class InternalNode<T extends ValueType> {
  // tslint:disable:no-bitwise
  static readonly LOG2DIM = 4; // log2 of tile count in one dimension
  static readonly TOTAL = InternalNode.LOG2DIM + LeafNode.TOTAL; // log2 of voxel count in one dimension
  static readonly DIM = 1 << InternalNode.TOTAL; // total voxel count in one dimension
  static readonly NUM_VALUES = 1 << (3 * InternalNode.LOG2DIM); // total voxel count represented by this node
  static readonly LEVEL = 1 + LeafNode.LEVEL; // level 0 = leaf
  static readonly NUM_VOXELS = 1 << (3 * InternalNode.TOTAL); // total voxel count represented by this node
  // tslint:enable:no-bitwise

  private childMask = new NodeMask();
  private valueMask = new NodeMask();

  private nodes: Array<NodeUnion<T, ChildNodeType<T>>> = new Array(InternalNode.NUM_VALUES);

  /**
   * Set the value of the voxel at the given coordinates and mark the voxel as active.
   */
  setValueOn(xyz: Coord, value: T): void {
    const n: Index = this.coordToOffset(xyz);
    const node = this.nodes[n];
    let hasChild = this.childMask.isOn(n);

    if (!hasChild) {
      const active = this.valueMask.isOn(n); // tile's active state

      if (!active || node.getValue() !== value) {
        // If the voxel belongs to a tile that is either inactive or that
        // has a constant value that is different from the one provided,
        // a child subtree must be constructed.
        hasChild = true;
        this.setChildNode(n, new LeafNode<T>(xyz, node.getValue(), active)); // TODO: s/LeafNode/ChildNode
      }
    }

    if (hasChild) {
      node.getChild().setValueOn(xyz, value);
    }
  }

  coordToOffset(xyz: Coord): Index {
    // tslint:disable:no-bitwise
    return (
      (((xyz[0] & (InternalNode.DIM - 1)) >> LeafNode.TOTAL) << (2 * InternalNode.LOG2DIM)) +
      (((xyz[1] & (InternalNode.DIM - 1)) >> LeafNode.TOTAL) << InternalNode.LOG2DIM) +
      ((xyz[2] & (InternalNode.DIM - 1)) >> LeafNode.TOTAL)
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
