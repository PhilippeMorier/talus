import { Coord, X, Y, Z } from '../math/coord';
import { InternalNode2 } from './internal-node';
import { Node } from './node';

export class RootNode<T> implements Node<T> {
  private table = new Map<string, NodeStruct<T>>();

  constructor(private background: T) {}

  /**
   * Return a MapType key for the given coordinates.
   * Can't use Coord directly since it's a reference type.
   * Convert it to a value type i.e. in a string in form of 'X,Y,Z'.
   */
  static coordToKey(xyz: Coord): string {
    // tslint:disable:no-bitwise
    const coord: Coord = [
      xyz[X] & ~(InternalNode2.DIM - 1),
      xyz[Y] & ~(InternalNode2.DIM - 1),
      xyz[Z] & ~(InternalNode2.DIM - 1),
    ];
    // tslint:enable:no-bitwise

    return coord.join(',');
  }

  setValueOn(xyz: Coord, value: T): void {
    const struct = this.findCoord(xyz);
    let child: Node<T>;

    if (!struct) {
      child = new InternalNode2(xyz, this.background);
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

  getValue(xyz: Coord): T {
    const struct = this.findCoord(xyz);

    if (!struct) {
      return this.background;
    }

    return struct.isTile() ? struct.getTile().value : struct.getChild().getValue(xyz);
  }

  isValueOn(xyz: Coord): boolean {
    const struct = this.findCoord(xyz);

    if (!struct || struct.isTileOff()) {
      return false;
    }

    return struct.isTileOn() ? true : struct.getChild().isValueOn(xyz);
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

  /**
   * Convert the given coordinates to a key and look the key up in this node's table.
   */
  private findCoord(xyz: Coord): NodeStruct<T> | undefined {
    return this.table.get(RootNode.coordToKey(xyz));
  }
}

class NodeStruct<T> {
  tile: Tile<T>;

  constructor(private child?: Node<T>) {}

  getChild(): Node<T> {
    return this.child;
  }

  setChild(child: Node<T>): void {
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
