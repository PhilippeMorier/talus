import { Coord, X, Y, Z } from '../math/coord';
import { NodeMask } from '../util/node-mask';
import { Index, LeafNode } from './leaf-node';
import { NodeUnion } from './node-union';

import { createDenseArray } from '../util/array';

type ChildNodeType<T> = InternalNode1<T> | LeafNode<T>;

abstract class InternalNode<T> {
  protected childMask: NodeMask;
  protected valueMask: NodeMask;
  protected origin: Coord;

  protected nodes: NodeUnion<T, ChildNodeType<T>>[];

  abstract coordToOffset(xyz: Coord): Index;

  abstract createChildNode(xyz: Coord, value?: T, active?: boolean): ChildNodeType<T>;

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
        this.setChildNode(i, this.createChildNode(xyz, node.getValue(), active));
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

  private setChildNode(i: Index, child: ChildNodeType<T>): void {
    if (this.childMask.isOn(i)) {
      throw new Error('Child is already on.');
    }

    this.childMask.setOn(i);
    this.valueMask.setOff(i);
    this.nodes[i].setChild(child);
  }

  private getChildNode(i: Index): ChildNodeType<T> {
    if (this.childMask.isOff(i)) {
      throw new Error('Child is off.');
    }

    return this.nodes[i].getChild();
  }
}

export class InternalNode1<T> extends InternalNode<T> {
  // tslint:disable:no-bitwise
  static readonly LOG2DIM = 4; // log2 of tile count in one dimension
  static readonly TOTAL = InternalNode1.LOG2DIM + LeafNode.TOTAL; // log2 of voxel count in one dimension
  static readonly DIM = 1 << InternalNode1.TOTAL; // total voxel count in one dimension
  static readonly NUM_VALUES = 1 << (3 * InternalNode1.LOG2DIM); // total child count represented by this node
  static readonly LEVEL = 1 + LeafNode.LEVEL; // level 0 = leaf
  static readonly NUM_VOXELS = 1 << (3 * InternalNode1.TOTAL); // total voxel count represented by this node
  // tslint:enable:no-bitwise

  constructor(xyz: Coord, value?: T, active: boolean = false) {
    super();

    this.childMask = new NodeMask(InternalNode1.NUM_VALUES);
    this.valueMask = new NodeMask(InternalNode1.NUM_VALUES);

    // tslint:disable:no-bitwise
    this.origin = [
      xyz[X] & ~(LeafNode.DIM - 1),
      xyz[Y] & ~(LeafNode.DIM - 1),
      xyz[Z] & ~(LeafNode.DIM - 1),
    ];
    // tslint:enable:no-bitwise

    if (active) {
      this.valueMask.setAllOn();
    }

    this.nodes = createDenseArray<NodeUnion<T, InternalNode1<T>>>(
      InternalNode1.NUM_VALUES,
      () => new NodeUnion<T, InternalNode1<T>>(value),
    );
  }

  createChildNode(xyz: [number, number, number], value?: T, active?: boolean): LeafNode<T> {
    return new LeafNode(xyz, value, active);
  }

  coordToOffset(xyz: Coord): Index {
    // tslint:disable:no-bitwise
    return (
      (((xyz[X] & (InternalNode1.DIM - 1)) >> LeafNode.TOTAL) << (2 * InternalNode1.LOG2DIM)) +
      (((xyz[Y] & (InternalNode1.DIM - 1)) >> LeafNode.TOTAL) << InternalNode1.LOG2DIM) +
      ((xyz[Z] & (InternalNode1.DIM - 1)) >> LeafNode.TOTAL)
    );
    // tslint:enable:no-bitwise
  }
}
