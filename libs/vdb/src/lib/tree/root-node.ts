import { Coord } from '../math/coord';
import { InternalNode1, InternalNode2 } from './internal-node';
import { HashableNode } from './node';
import { ValueAccessor3 } from './value-accessor';
import { Voxel } from './voxel';

export class RootNode<T> implements HashableNode<T> {
  static readonly LEVEL = 1 + InternalNode2.LEVEL; // level 0 = leaf

  private table = new Map<string, NodeStruct<T>>();

  constructor(private _background: T) {}

  /**
   * Return a MapType key for the given coordinates.
   * Can't use Coord directly since it's a reference type.
   * Convert it to a value type i.e. in a string in form of 'X,Y,Z'.
   */
  static coordToKey(xyz: Coord): string {
    // tslint:disable:no-bitwise
    const coord: Coord = [
      xyz[0] & InternalNode2.DIM_MAX_INDEX_INVERTED,
      xyz[1] & InternalNode2.DIM_MAX_INDEX_INVERTED,
      xyz[2] & InternalNode2.DIM_MAX_INDEX_INVERTED,
    ];
    // tslint:enable:no-bitwise

    return coord.join(',');
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

  /**
   * Convert the given coordinates to a key and look the key up in this node's table.
   */
  private findCoord(xyz: Coord): NodeStruct<T> | undefined {
    return this.table.get(RootNode.coordToKey(xyz));
  }
}

class NodeStruct<T> {
  tile: Tile<T>;

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
    return this.tile;
  }

  isTile(): boolean {
    return this.child === undefined;
  }

  isTileOff(): boolean {
    return this.isTile() && !this.tile.active;
  }

  isTileOn(): boolean {
    return this.isTile() && this.tile.active;
  }
}

class Tile<T> {
  value: T;
  active: boolean;
}
