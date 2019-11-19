import { Coord, X, Y, Z } from '../math/coord';
import { NodeMask } from '../util/node-mask';
import { Index, LeafNode } from './leaf-node';
import { NodeUnion } from './node-union';

import { createDenseArray } from '../util/array';

type ChildNodeType<T> = InternalNode1<T> | LeafNode<T>;

abstract class InternalNode<T> {
  protected readonly childMask: NodeMask;
  protected readonly valueMask: NodeMask;
  protected readonly origin: Coord;

  protected nodes: NodeUnion<T, ChildNodeType<T>>[];

  protected constructor(
    numValues: number,
    childNodeDim: number,
    xyz: Coord,
    value?: T,
    active: boolean = false,
  ) {
    this.childMask = new NodeMask(numValues);
    this.valueMask = new NodeMask(numValues);

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

    this.nodes = createDenseArray<NodeUnion<T, ChildNodeType<T>>>(
      InternalNode1.NUM_VALUES,
      () => new NodeUnion(value),
    );
  }

  protected calcCoordToOffset(
    dim: number,
    log2dim: number,
    childNodeTotal: number,
    xyz: Coord,
  ): Index {
    // tslint:disable:no-bitwise
    return (
      (((xyz[X] & (dim - 1)) >> childNodeTotal) << (2 * log2dim)) +
      (((xyz[Y] & (dim - 1)) >> childNodeTotal) << log2dim) +
      ((xyz[Z] & (dim - 1)) >> childNodeTotal)
    );
    // tslint:enable:no-bitwise
  }

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
    super(InternalNode1.NUM_VALUES, LeafNode.DIM, xyz, value, active);
  }

  createChildNode(xyz: [number, number, number], value?: T, active?: boolean): LeafNode<T> {
    return new LeafNode(xyz, value, active);
  }

  coordToOffset(xyz: Coord): Index {
    return this.calcCoordToOffset(InternalNode1.DIM, InternalNode1.LOG2DIM, LeafNode.TOTAL, xyz);
  }
}

export class InternalNode2<T> extends InternalNode<T> {
  // tslint:disable:no-bitwise
  static readonly LOG2DIM = 5; // log2 of tile count in one dimension
  static readonly TOTAL = InternalNode2.LOG2DIM + InternalNode1.TOTAL; // log2 of voxel count in one dimension
  static readonly DIM = 1 << InternalNode2.TOTAL; // total voxel count in one dimension
  static readonly NUM_VALUES = 1 << (3 * InternalNode2.LOG2DIM); // total child count represented by this node
  static readonly LEVEL = 1 + InternalNode1.LEVEL; // level 0 = leaf
  // Operands of all bitwise operators are converted to signed 32-bit. Therefore, 1 << 31 >>> 0 is the largest
  // uint we can get with bit-shift.
  // static readonly NUM_VOXELS = 1 << (3 * InternalNode2.TOTAL); // total voxel count represented by this node
  static readonly NUM_VOXELS = Math.pow(2, 3 * InternalNode2.TOTAL);
  // tslint:enable:no-bitwise

  constructor(xyz: Coord, value?: T, active: boolean = false) {
    super(InternalNode2.NUM_VALUES, InternalNode1.DIM, xyz, value, active);
  }

  createChildNode(xyz: [number, number, number], value?: T, active?: boolean): InternalNode1<T> {
    return new InternalNode1(xyz, value, active);
  }

  coordToOffset(xyz: Coord): Index {
    return this.calcCoordToOffset(
      InternalNode2.DIM,
      InternalNode2.LOG2DIM,
      InternalNode1.TOTAL,
      xyz,
    );
  }
}
