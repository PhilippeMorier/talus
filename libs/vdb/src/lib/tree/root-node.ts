import { Coord, CoordBBox } from '../math';
import { InternalNode1, InternalNode2 } from './internal-node';
import { LeafNode } from './leaf-node';
import { ChildNode, HashableNode } from './node';
import { ValueAccessor3 } from './value-accessor';
import { Voxel } from './voxel';

export class RootNode<T> implements HashableNode<T> {
  static readonly LEVEL = 1 + InternalNode2.LEVEL; // level 0 = leaf

  private table = new Map<string, NodeStruct<T>>();

  constructor(private _background: T) {}

  /**
   * Return a MapType key for the given coordinates.
   *
   * Can't use Coord directly since it's a reference type.
   * Convert it to a value type i.e. in a string in form of 'X,Y,Z'.
   */
  static coordToKey(xyz: Coord): string {
    // tslint:disable:no-bitwise
    const coord: Coord = {
      x: xyz.x & InternalNode2.DIM_MAX_INDEX_INVERTED,
      y: xyz.y & InternalNode2.DIM_MAX_INDEX_INVERTED,
      z: xyz.z & InternalNode2.DIM_MAX_INDEX_INVERTED,
    };
    // tslint:enable:no-bitwise

    return `${coord.x},${coord.y},${coord.z}`;
  }

  static keyToCoord(key: string): Coord {
    const xyz = key.split(',');

    return { x: Number(xyz[0]), y: Number(xyz[1]), z: Number(xyz[2]) };
  }

  get background(): T {
    return this._background;
  }

  getValue(xyz: Coord): T {
    const struct = this.findCoord(xyz);

    if (!struct) {
      return this._background;
    }

    return struct.isTile() ? struct.getTile().value : struct.getChild().getValue(xyz);
  }

  getValueAndCache(xyz: Coord, accessor: ValueAccessor3<T>): T {
    const struct = this.findCoord(xyz);

    if (!struct) {
      return this._background;
    }

    if (struct.isChild()) {
      accessor.insert(xyz, struct.getChild());
      return struct.getChild().getValueAndCache(xyz, accessor);
    }

    return struct.getTile().value;
  }

  /**
   * Return the bounding box of this RootNode, i.e., an infinite bounding box.
   */
  getNodeBoundingBox(): CoordBBox {
    return CoordBBox.inf();
  }

  probeLeafNodeAndCache(xyz: Coord, accessor: ValueAccessor3<T>): LeafNode<T> | undefined {
    const struct = this.findCoord(xyz);

    if (!struct || struct.isTile()) {
      return undefined;
    }

    const child = struct.getChild();
    accessor.insert(xyz, child);

    return child.probeLeafNodeAndCache(xyz, accessor);
  }

  probeInternalNode1AndCache(
    xyz: Coord,
    accessor: ValueAccessor3<T>,
  ): InternalNode1<T> | undefined {
    const struct = this.findCoord(xyz);

    if (!struct || struct.isTile()) {
      return undefined;
    }

    const child = struct.getChild();
    accessor.insert(xyz, child);

    return child.probeInternalNode1AndCache(xyz, accessor);
  }

  touchLeafAndCache(xyz: Coord, accessor: ValueAccessor3<T>): LeafNode<T> {
    let child: HashableNode<T> | undefined;
    const struct = this.findCoord(xyz);

    if (!struct) {
      child = new InternalNode2(xyz, this._background, false);
      this.table.set(RootNode.coordToKey(xyz), new NodeStruct(child));
    } else if (struct.isChild()) {
      child = struct.getChild();
    } else {
      child = new InternalNode2(xyz, struct.getTile().value, struct.isTileOn());
      struct.setChild(child);
    }

    accessor.insert(xyz, child);

    return child.touchLeafAndCache(xyz, accessor);
  }

  setValueOn(xyz: Coord, value: T): void {
    let child: HashableNode<T> | undefined;
    const struct = this.findCoord(xyz);

    if (!struct) {
      child = new InternalNode2(xyz, this._background);
      this.table.set(RootNode.coordToKey(xyz), new NodeStruct(child));
    } else if (struct.isChild()) {
      child = struct.getChild();
    } else if (struct.isTileOff()) {
      child = new InternalNode2(xyz, struct.getTile().value, struct.isTileOn());
      struct.setChild(child);
    }

    if (child) {
      child.setValueOn(xyz, value);
    }
  }

  setValueAndCache(xyz: Coord, value: T, accessor: ValueAccessor3<T>): void {
    let child: HashableNode<T> | undefined;
    const struct = this.findCoord(xyz);

    if (!struct) {
      child = new InternalNode2(xyz, this._background);
      this.table.set(RootNode.coordToKey(xyz), new NodeStruct(child));
    } else if (struct.isChild()) {
      child = struct.getChild();
    } else if (struct.isTileOff()) {
      child = new InternalNode2(xyz, struct.getTile().value, struct.isTileOn());
      struct.setChild(child);
    }

    if (child) {
      accessor.insert(xyz, child);
      child.setValueAndCache(xyz, value, accessor);
    }
  }

  setValueOffAndCache(xyz: Coord, value: T, accessor: ValueAccessor3<T>): void {
    let child: HashableNode<T> | undefined;
    const struct = this.findCoord(xyz);

    if (!struct) {
      if (this._background !== value) {
        child = new InternalNode2(xyz, this._background);
        this.table.set(RootNode.coordToKey(xyz), new NodeStruct(child));
      }
    } else if (struct.isChild()) {
      child = struct.getChild();
    } else if (struct.isTileOn() || struct.getTile().value !== value) {
      child = new InternalNode2(xyz, struct.getTile().value, struct.isTileOn());
      struct.setChild(child);
    }

    if (child) {
      accessor.insert(xyz, child);
      child.setValueOffAndCache(xyz, value, accessor);
    }
  }

  setActiveStateAndCache(xyz: Coord, on: boolean, accessor: ValueAccessor3<T>): void {
    let child: HashableNode<T> | undefined;
    const struct = this.findCoord(xyz);

    if (!struct) {
      if (on) {
        child = new InternalNode2(xyz, this._background);
        this.table.set(RootNode.coordToKey(xyz), new NodeStruct(child));
      } /*else {
        // Nothing to do; (x, y, z) is background and therefore already inactive.
      }*/
    } else if (struct.isChild()) {
      child = struct.getChild();
    } else if (on !== struct.getTile().active) {
      child = new InternalNode2(xyz, struct.getTile().value, !on);
      struct.setChild(child);
    }

    if (child) {
      accessor.insert(xyz, child);
      child.setActiveStateAndCache(xyz, on, accessor);
    }
  }

  isValueOn(xyz: Coord): boolean {
    const struct = this.findCoord(xyz);

    if (!struct || struct.isTileOff()) {
      return false;
    }

    return struct.isTileOn() ? true : struct.getChild().isValueOn(xyz);
  }

  isValueOnAndCache(xyz: Coord, accessor: ValueAccessor3<T>): boolean {
    const struct = this.findCoord(xyz);

    if (!struct || struct.isTileOff()) {
      return false;
    }

    if (struct.isTileOn()) {
      return true;
    }

    accessor.insert(xyz, struct.getChild());

    return struct.getChild().isValueOnAndCache(xyz, accessor);
  }

  onVoxelCount(): number {
    let sum = 0;
    for (const nodeStruct of this.table.values()) {
      if (nodeStruct.isChild()) {
        sum += nodeStruct.getChild().onVoxelCount();
      } else if (nodeStruct.isTile()) {
        sum += InternalNode2.NUM_VOXELS;
      }
    }

    return sum;
  }

  /**
   * Return the number of entries in this node's table.
   */
  getTableSize(): number {
    return this.table.size;
  }

  *beginVoxelOn(): IterableIterator<Voxel<T>> {
    for (const nodeStruct of this.table.values()) {
      if (nodeStruct.isChild()) {
        yield* nodeStruct.getChild().beginVoxelOn();
      }
    }
  }

  *beginValueOn(): IterableIterator<ChildNode<T>> {
    for (const nodeStruct of this.table.values()) {
      if (nodeStruct.isChild()) {
        yield* nodeStruct.getChild().beginValueOn();
      }
    }
  }

  /**
   * Return true if this node's table is either empty or contains only background tiles.
   */
  empty(): boolean {
    return this.table.size === this.numBackgroundTiles();
  }

  /**
   * Return the number of background tiles.
   */
  numBackgroundTiles(): number {
    let count = 0;
    for (const nodeStruct of this.table.values()) {
      if (this.isBackgroundTile(nodeStruct)) {
        ++count;
      }
    }

    return count;
  }

  isBackgroundTile(nodeStruct: NodeStruct<T>): boolean {
    return nodeStruct.isTileOff() && nodeStruct.getTile().value === this._background;
  }

  /**
   * @brief Expand the specified bbox so it includes the active tiles of
   * this root node as well as all the active values in its child
   * nodes. If visitVoxels is false LeafNodes will be approximated
   * as dense, i.e. with all voxels active. Else the individual
   * active voxels are visited to produce a tight bbox.
   */
  evalActiveBoundingBox(bbox: CoordBBox, visitVoxels = true): void {
    for (const [key, nodeStruct] of this.table) {
      const child = nodeStruct.isChild() && nodeStruct.getChild();
      if (child) {
        child.evalActiveBoundingBox(bbox, visitVoxels);
      } else if (nodeStruct.isTileOn()) {
        bbox.expand(RootNode.keyToCoord(key), InternalNode2.DIM);
      }
    }
  }

  /**
   * Convert the given coordinates to a key and look the key up in this node's table.
   */
  private findCoord(xyz: Coord): NodeStruct<T> | undefined {
    return this.table.get(RootNode.coordToKey(xyz));
  }
}

/**
 * This lightweight struct pairs child pointers and tiles.
 */
class NodeStruct<T> {
  private tile?: Tile<T>;

  constructor(private child?: HashableNode<T>) {}

  getChild(): HashableNode<T> {
    if (!this.child) {
      throw new Error('Access undefined child.');
    }

    return this.child;
  }

  setChild(child: HashableNode<T>): void {
    this.child = child;
  }

  isChild(): boolean {
    return this.child !== undefined;
  }

  getTile(): Tile<T> {
    if (!this.tile) {
      throw new Error('Tile is not set.');
    }

    return this.tile;
  }

  isTile(): boolean {
    return this.child === undefined;
  }

  isTileOff(): boolean {
    return this.isTile() && !this.tile?.active;
  }

  isTileOn(): boolean {
    return this.isTile() && Boolean(this.tile?.active);
  }
}

interface Tile<ValueType> {
  value: ValueType;
  active: boolean;
}
