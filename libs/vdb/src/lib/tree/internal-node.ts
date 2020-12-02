import { Coord, CoordBBox } from '../math';
import { Index } from '../types';
import { createDenseArray } from '../util/array';
import { NodeMask } from '../util/node-mask';
import { LeafNode } from './leaf-node';
import { ChildNode, HashableNode } from './node';
import { NodeUnion } from './node-union';
import { ValueAccessor3 } from './value-accessor';
import { Voxel } from './voxel';

abstract class InternalNode<T> implements HashableNode<T> {
  origin?: Coord;
  protected childMask = new NodeMask(0);
  protected valueMask = new NodeMask(0);

  protected nodes: NodeUnion<T, HashableNode<T>>[] = [];

  constructor(xyz: Coord, value?: T, active = false) {
    if (this instanceof InternalNode1) {
      this.initializeInternalNode1(xyz, value, active);
    } else if (this instanceof InternalNode2) {
      this.initializeInternalNode2(xyz, value, active);
    }
  }

  protected calcCoordToOffset(
    dim: number,
    log2dim: number,
    childNodeTotal: number,
    xyz: Coord,
  ): Index {
    // tslint:disable:no-bitwise
    return (
      (((xyz.x & (dim - 1)) >> childNodeTotal) << (2 * log2dim)) +
      (((xyz.y & (dim - 1)) >> childNodeTotal) << log2dim) +
      ((xyz.z & (dim - 1)) >> childNodeTotal)
    );
    // tslint:enable:no-bitwise
  }

  protected *beginChildOn(): IterableIterator<HashableNode<T>> {
    for (const index of this.childMask.beginOn()) {
      const child = this.nodes[index].getChild();
      if (!child) {
        throw new Error('Child mask is on but child is undefined.');
      }

      yield child;
    }
  }

  protected calcOnVoxelCount(childNodeNumVoxels: number): number {
    let sum: number = childNodeNumVoxels * this.valueMask.countOn();
    for (const child of this.beginChildOn()) {
      sum += child.onVoxelCount();
    }

    return sum;
  }

  abstract coordToOffset(xyz: Coord): Index;

  abstract createChildNode(xyz: Coord, value?: T, active?: boolean): HashableNode<T>;

  abstract onVoxelCount(): number;

  getValue(xyz: Coord): T {
    const i: Index = this.coordToOffset(xyz);

    if (this.childMask.isOff(i)) {
      const value = this.nodes[i].getValue();
      if (!value) {
        throw new Error('Child mask is off but value is undefined.');
      }

      return value;
    }

    const child = this.nodes[i].getChild();
    if (!child) {
      throw new Error('Child mask is on but child is undefined.');
    }

    return child.getValue(xyz);
  }

  getValueAndCache(xyz: Coord, accessor: ValueAccessor3<T>): T {
    const i: Index = this.coordToOffset(xyz);
    const node = this.nodes[i];

    if (this.childMask.isOn(i)) {
      const child = node.getChild();
      if (!child) {
        throw new Error('Child mask is on but child is undefined.');
      }

      accessor.insert(xyz, child);
      return child.getValueAndCache(xyz, accessor);
    }

    const value = node.getValue();
    if (!value) {
      throw new Error('Child mask is off but value is undefined.');
    }

    return value;
  }

  probeLeafNodeAndCache(xyz: Coord, accessor: ValueAccessor3<T>): LeafNode<T> | undefined {
    const i: Index = this.coordToOffset(xyz);
    if (this.childMask.isOff(i)) {
      return undefined;
    }

    const node = this.nodes[i];
    const child = node.getChild();
    if (!child) {
      throw new Error('Child mask is on but child is undefined.');
    }

    accessor.insert(xyz, child);

    return child.probeLeafNodeAndCache(xyz, accessor);
  }

  touchLeafAndCache(xyz: Coord, accessor: ValueAccessor3<T>): LeafNode<T> {
    const i: Index = this.coordToOffset(xyz);
    const node = this.nodes[i];

    if (this.childMask.isOff(i)) {
      this.setChildNode(i, this.createChildNode(xyz, node.getValue(), this.valueMask.isOn(i)));
    }

    const child = node.getChild();
    if (!child) {
      throw new Error('Child node was set but child is still undefined.');
    }

    accessor.insert(xyz, child);

    return child.touchLeafAndCache(xyz, accessor);
  }

  probeInternalNode1AndCache(
    xyz: Coord,
    accessor: ValueAccessor3<T>,
  ): InternalNode1<T> | undefined {
    const i: Index = this.coordToOffset(xyz);
    if (this.childMask.isOff(i)) {
      return undefined;
    }

    const node = this.nodes[i];
    const child = node.getChild();
    if (!child) {
      throw new Error('Child mask is on but child is undefined.');
    }

    accessor.insert(xyz, child);

    return child instanceof InternalNode1 ? child : child.probeInternalNode1AndCache(xyz, accessor);
  }

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
      const child = node.getChild();
      if (!child) {
        throw new Error('Child mask is on or child node was set but child is still undefined.');
      }

      child.setValueOn(xyz, value);
    }
  }

  setValueAndCache(xyz: Coord, value: T, accessor: ValueAccessor3<T>): void {
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
      const child = node.getChild();
      if (!child) {
        throw new Error('Child mask is on or child node was set but child is still undefined.');
      }

      accessor.insert(xyz, child);
      child.setValueAndCache(xyz, value, accessor);
    }
  }

  setValueOffAndCache(xyz: Coord, value: T, accessor: ValueAccessor3<T>): void {
    const i: Index = this.coordToOffset(xyz);
    const node = this.nodes[i];
    let hasChild = this.childMask.isOn(i);

    if (!hasChild) {
      const active = this.valueMask.isOn(i); // tile's active state

      if (active || node.getValue() !== value) {
        // If the voxel belongs to a tile that is either active or that
        // has a constant value that is different from the one provided,
        // a child subtree must be constructed.
        hasChild = true;
        this.setChildNode(i, this.createChildNode(xyz, node.getValue(), active));
      }
    }

    if (hasChild) {
      const child = node.getChild();
      if (!child) {
        throw new Error('Child mask is on or child node was set but child is still undefined.');
      }

      accessor.insert(xyz, child);
      child.setValueOffAndCache(xyz, value, accessor);
    }
  }

  setActiveStateAndCache(xyz: Coord, on: boolean, accessor: ValueAccessor3<T>): void {
    const i: Index = this.coordToOffset(xyz);
    const node = this.nodes[i];
    let hasChild = this.childMask.isOn(i);

    if (!hasChild) {
      if (on !== this.valueMask.isOn(i)) {
        // If the voxel belongs to a tile with the wrong active state,
        // then a child subtree must be constructed.
        // 'on' is the voxel's new state, therefore '!on' is the tile's current state
        hasChild = true;
        this.setChildNode(i, this.createChildNode(xyz, node.getValue(), !on));
      }
    }

    if (hasChild) {
      const child = node.getChild();
      if (!child) {
        throw new Error('Child mask is on or child node was set but child is still undefined.');
      }

      accessor.insert(xyz, child);
      child.setActiveStateAndCache(xyz, on, accessor);
    }
  }

  isValueOn(xyz: Coord): boolean {
    const i: Index = this.coordToOffset(xyz);
    if (this.childMask.isOff(i)) {
      return this.valueMask.isOn(i);
    }

    const child = this.nodes[i].getChild();
    if (!child) {
      throw new Error('Child mask is on but child is undefined.');
    }

    return child.isValueOn(xyz);
  }

  isValueOnAndCache(xyz: Coord, accessor: ValueAccessor3<T>): boolean {
    const i: Index = this.coordToOffset(xyz);
    if (this.childMask.isOff(i)) {
      return this.valueMask.isOn(i);
    }

    const child = this.nodes[i].getChild();
    if (!child) {
      throw new Error('Child mask is on but child is undefined.');
    }
    accessor.insert(xyz, child);

    return child.isValueOnAndCache(xyz, accessor);
  }

  /**
   * @brief Expand the specified bounding box so that it includes the active tiles
   * of this internal node as well as all the active values in its child nodes.
   * If visitVoxels is false LeafNodes will be approximated as dense, i.e. with all
   * voxels active. Else the individual active voxels are visited to produce a tight bbox.
   */
  evalActiveBoundingBox(bbox: CoordBBox, visitVoxels = true): void {
    if (bbox.isInside(this.getNodeBoundingBox())) {
      return;
    }

    const dim = this instanceof InternalNode2 ? InternalNode1.DIM : LeafNode.DIM;
    for (const child of this.beginValueOn()) {
      bbox.expand(child.origin, dim);
    }

    for (const child of this.beginChildOn()) {
      child.evalActiveBoundingBox(bbox, visitVoxels);
    }
  }

  getNodeBoundingBox(): CoordBBox {
    if (!this.origin) {
      throw new Error('Origin is not set. Call "initialize()" first.');
    }

    const dim = this instanceof InternalNode2 ? InternalNode2.DIM : InternalNode1.DIM;

    return CoordBBox.createCube(this.origin, dim);
  }

  *beginVoxelOn(): IterableIterator<Voxel<T>> {
    for (const index of this.childMask.beginOn()) {
      const child = this.nodes[index].getChild();
      if (!child) {
        throw new Error('Child mask is on but child is undefined.');
      }

      yield* child.beginVoxelOn();
    }
  }

  *beginValueOn(): IterableIterator<ChildNode<T>> {
    for (const index of this.valueMask.beginOn()) {
      const child = this.nodes[index].getChild();
      if (!child) {
        throw new Error('Value mask is on but child is undefined.');
      }

      yield* child.beginValueOn();
    }
  }

  protected initializeInternalNode1(xyz: Coord, value?: T, active = false): void {
    this.initialize(
      InternalNode1.NUM_VALUES,
      InternalNode1.DIM_MAX_INDEX_INVERTED,
      xyz,
      value,
      active,
    );
  }

  protected initializeInternalNode2(xyz: Coord, value?: T, active = false): void {
    this.initialize(
      InternalNode2.NUM_VALUES,
      InternalNode2.DIM_MAX_INDEX_INVERTED,
      xyz,
      value,
      active,
    );
  }

  private initialize(
    numValues: number,
    dimMaxIndexInverted: number,
    xyz: Coord,
    value?: T,
    active = false,
  ): void {
    this.childMask = new NodeMask(numValues);
    this.valueMask = new NodeMask(numValues);

    // tslint:disable:no-bitwise
    this.origin = {
      x: xyz.x & dimMaxIndexInverted,
      y: xyz.y & dimMaxIndexInverted,
      z: xyz.z & dimMaxIndexInverted,
    };
    // tslint:enable:no-bitwise

    if (active) {
      this.valueMask.setAllOn();
    }

    this.nodes = createDenseArray<NodeUnion<T, HashableNode<T>>>(
      numValues,
      () => new NodeUnion(value),
    );
  }

  private setChildNode(i: Index, child: HashableNode<T>): void {
    if (this.childMask.isOn(i)) {
      throw new Error('Child is already on.');
    }

    this.childMask.setOn(i);
    this.valueMask.setOff(i);
    this.nodes[i].setChild(child);
  }
}

export class InternalNode1<T> extends InternalNode<T> {
  // tslint:disable:no-bitwise
  static readonly LOG2DIM = 3; // log2 of tile count in one dimension
  static readonly TOTAL = InternalNode1.LOG2DIM + LeafNode.TOTAL; // log2 of voxel count in one dimension
  static readonly DIM = 1 << InternalNode1.TOTAL; // total voxel count in one dimension
  static readonly DIM_MAX_INDEX_INVERTED: Index = ~(InternalNode1.DIM - 1); // Performance: max index
  static readonly NUM_VALUES = 1 << (3 * InternalNode1.LOG2DIM); // total child count represented by this node
  static readonly LEVEL = 1 + LeafNode.LEVEL; // level 0 = leaf
  static readonly NUM_VOXELS = 1 << (3 * InternalNode1.TOTAL); // total voxel count represented by this node
  // tslint:enable:no-bitwise

  createChildNode(xyz: Coord, value?: T, active?: boolean): LeafNode<T> {
    return new LeafNode(xyz, value, active);
  }

  coordToOffset(xyz: Coord): Index {
    return this.calcCoordToOffset(InternalNode1.DIM, InternalNode1.LOG2DIM, LeafNode.TOTAL, xyz);
  }

  onVoxelCount(): number {
    return this.calcOnVoxelCount(LeafNode.NUM_VOXELS);
  }
}

export class InternalNode2<T> extends InternalNode<T> {
  // tslint:disable:no-bitwise
  static readonly LOG2DIM = 2; // log2 of tile count in one dimension
  static readonly TOTAL = InternalNode2.LOG2DIM + InternalNode1.TOTAL; // log2 of voxel count in one dimension
  static readonly DIM = 1 << InternalNode2.TOTAL; // total voxel count in one dimension
  static readonly DIM_MAX_INDEX_INVERTED: Index = ~(InternalNode2.DIM - 1); // Performance: max index
  static readonly NUM_VALUES = 1 << (3 * InternalNode2.LOG2DIM); // total child count represented by this node
  static readonly LEVEL = 1 + InternalNode1.LEVEL; // level 0 = leaf
  // Operands of all bitwise operators are converted to signed 32-bit. Therefore, 1 << 31 >>> 0 is the largest
  // uint we can get with bit-shift.
  // static readonly NUM_VOXELS = 1 << (3 * InternalNode2.TOTAL); // total voxel count represented by this node
  static readonly NUM_VOXELS = Math.pow(2, 3 * InternalNode2.TOTAL);
  // tslint:enable:no-bitwise

  createChildNode(xyz: Coord, value?: T, active?: boolean): InternalNode1<T> {
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

  onVoxelCount(): number {
    return this.calcOnVoxelCount(InternalNode1.NUM_VOXELS);
  }
}
