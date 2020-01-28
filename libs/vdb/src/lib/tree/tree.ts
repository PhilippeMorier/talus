import { Coord } from '../math/coord';
import { Node } from './node';
import { RootNode } from './root-node';
import { Voxel } from './voxel';

export class Tree<T> implements Node<T> {
  static readonly DEPTH = 1 + RootNode.LEVEL; // level 0 = leaf

  public readonly root: RootNode<T>;

  constructor(background: T) {
    this.root = new RootNode<T>(background);
  }

  get background(): T {
    return this.root.background;
  }

  getValue(xyz: Coord): T {
    return this.root.getValue(xyz);
  }

  isValueOn(xyz: Coord): boolean {
    return this.root.isValueOn(xyz);
  }

  onVoxelCount(): number {
    return this.root.onVoxelCount();
  }

  setValueOn(xyz: Coord, value: T): void {
    this.root.setValueOn(xyz, value);
  }

  beginVoxelOn(): IterableIterator<Voxel<T>> {
    return this.root.beginVoxelOn();
  }

  empty(): boolean {
    return this.root.empty();
  }
}
