import { Coord, createMaxCoord, X, Y, Z } from '../math/coord';
import { InternalNode1, InternalNode2 } from './internal-node';
import { LeafNode } from './leaf-node';
import { HashableNode } from './node';
import { Tree } from './tree';

/**
 * A ValueAccessor caches pointers to tree nodes along the path to a voxel (x, y, z).
 * A subsequent access to voxel (x', y', z') starts from the cached leaf node and
 * moves up until a cached node that encloses (x', y', z') is found, then traverses
 * down the tree from that node to a leaf, updating the cache with the new path.
 * This leads to significant acceleration of spatially-coherent accesses.
 *
 * @brief Value accessor with three levels of node caching.
 * @details The node cache levels are specified by L0, L1, and L2
 * with the default values 0, 1 and 2 (defined in the forward declaration)
 * corresponding to a LeafNode, its parent InternalNode, and its parent InternalNode.
 * The configuration is hard-coded and has a depth of four.
 */
export class ValueAccessor3<T> {
  constructor(private tree: Tree<T>) {}

  private leafKey: Coord = createMaxCoord();
  private leafNode: LeafNode<T>;

  private internalKey1: Coord = createMaxCoord();
  private internalNode1: InternalNode1<T>;

  private internalKey2: Coord = createMaxCoord();
  private internalNode2: InternalNode2<T>;

  /**
   * Return true if any of the nodes along the path to the given voxel have been cached.
   */
  isCached(xyz: Coord): boolean {
    return this.isHashed2(xyz) || this.isHashed1(xyz) || this.isHashed0(xyz);
  }

  /**
   * Return the value of the voxel at the given coordinates.
   */
  getValue(xyz: Coord): T {
    if (this.isHashed0(xyz)) {
      return this.leafNode.getValueAndCache(xyz, this);
    } else if (this.isHashed1(xyz)) {
      return this.internalNode1.getValueAndCache(xyz, this);
    } else if (this.isHashed2(xyz)) {
      return this.internalNode2.getValueAndCache(xyz, this);
    } else {
      return this.tree.root.getValueAndCache(xyz, this);
    }
  }

  /**
   * Set the value of the voxel at the given coordinates and mark the voxel as active.
   */
  setValue(xyz: Coord, value: T): void {
    if (this.isHashed0(xyz)) {
      this.leafNode.setValueAndCache(xyz, value, this);
    } else if (this.isHashed1(xyz)) {
      this.internalNode1.setValueAndCache(xyz, value, this);
    } else if (this.isHashed2(xyz)) {
      this.internalNode2.setValueAndCache(xyz, value, this);
    } else {
      this.tree.root.setValueAndCache(xyz, value, this);
    }
  }

  // tslint:disable:no-bitwise
  insert(xyz: Coord, node: HashableNode<T>): void {
    if (node instanceof LeafNode) {
      this.leafKey[X] = xyz[X] & ~(LeafNode.DIM - 1);
      this.leafKey[Y] = xyz[Y] & ~(LeafNode.DIM - 1);
      this.leafKey[Z] = xyz[Z] & ~(LeafNode.DIM - 1);
      this.leafNode = node;
    } else if (node instanceof InternalNode1) {
      this.internalKey1[X] = xyz[X] & ~(InternalNode1.DIM - 1);
      this.internalKey1[Y] = xyz[Y] & ~(InternalNode1.DIM - 1);
      this.internalKey1[Z] = xyz[Z] & ~(InternalNode1.DIM - 1);
      this.internalNode1 = node;
    } else if (node instanceof InternalNode2) {
      this.internalKey2[X] = xyz[X] & ~(InternalNode2.DIM - 1);
      this.internalKey2[Y] = xyz[Y] & ~(InternalNode2.DIM - 1);
      this.internalKey2[Z] = xyz[Z] & ~(InternalNode2.DIM - 1);
      this.internalNode2 = node;
    }
  }

  private isHashed0(xyz: Coord): boolean {
    return (
      (xyz[X] & ~(LeafNode.DIM - 1)) === this.leafKey[X] &&
      (xyz[Y] & ~(LeafNode.DIM - 1)) === this.leafKey[Y] &&
      (xyz[Z] & ~(LeafNode.DIM - 1)) === this.leafKey[Z]
    );
  }

  private isHashed1(xyz: Coord): boolean {
    return (
      (xyz[X] & ~(InternalNode1.DIM - 1)) === this.internalKey1[X] &&
      (xyz[Y] & ~(InternalNode1.DIM - 1)) === this.internalKey1[Y] &&
      (xyz[Z] & ~(InternalNode1.DIM - 1)) === this.internalKey1[Z]
    );
  }

  private isHashed2(xyz: Coord): boolean {
    return (
      (xyz[X] & ~(InternalNode2.DIM - 1)) === this.internalKey2[X] &&
      (xyz[Y] & ~(InternalNode2.DIM - 1)) === this.internalKey2[Y] &&
      (xyz[Z] & ~(InternalNode2.DIM - 1)) === this.internalKey2[Z]
    );
  }
  // tslint:enable:no-bitwise
}

// /**
//  * An element of a compile-time linked list of node pointers, ordered from LeafNode to RootNode.
//  */
// type SubtreeT<T> = [RootNode<T>, InternalNode2<T>, InternalNode1<T>, LeafNode<T>];
//
// export class CacheItem<T> {
//   private parent: ValueAccessor3<InternalNode2<T>>;
//
//   private hash: Coord;
//   private node: InternalNode2<T>;
//   private next: CacheItem<RootNode<T>>;
//
//   constructor() {
//     this.hash = createMaxCoord();
//   }
//
//   /**
//    * Return the value of the voxel at the given coordinates.
//    */
//   // getValue(xyz: Coord): T {
//   //   if (this.isHashed(xyz)) {
//   //     return this.node.getValueAndCache(xyz, this.parent);
//   //   }
//   //   return this.next.getValue(xyz);
//   // }
//
//   /**
//    * Set the value of the voxel at the given coordinates and mark the voxel as active.
//    */
//   // setValue(xyz: Coord, value: T): void {
//   //   if (this.isHashed(xyz)) {
//   //     //   assert(mNode);
//   //     //   static_assert(!TreeCacheT::IsConstTree, "can't modify a const tree's values");
//   //     //   const_cast<NodeType*>(mNode)->setValueAndCache(xyz, value, *mParent);
//   //     this.node.setValueAndCache(xyz, value, this.parent);
//   //     // } else {
//   //     //   mNext.setValue(xyz, value);
//   //   }
//   // }
//
//   isHashed(xyz: Coord): boolean {
//     // tslint:disable:no-bitwise
//     return (
//       (xyz[X] & (~InternalNode2.DIM - 1)) === this.hash[0] &&
//       (xyz[Y] & (~InternalNode2.DIM - 1)) === this.hash[1] &&
//       (xyz[Z] & (~InternalNode2.DIM - 1)) === this.hash[2]
//     );
//     // tslint:enable:no-bitwise
//   }
//
//   /**
//    * Cache the given node at this level
//    * OR
//    * Forward the given node to another level of the cache.
//    */
//   insert(xyz: Coord, node?: Node<T>): void {
//     if (node instanceof RootNode) {
//       this.next.insert(xyz, node);
//     }
//
//     if (node instanceof InternalNode2) {
//       this.insertNode(xyz, node);
//     }
//   }
//
//   private insertNode(xyz: Coord, node: InternalNode2<T>): void {
//     if (node) {
//       // tslint:disable:no-bitwise
//       this.hash[X] = xyz[X] & ~(InternalNode2.DIM - 1);
//       this.hash[Y] = xyz[Y] & ~(InternalNode2.DIM - 1);
//       this.hash[Z] = xyz[Z] & ~(InternalNode2.DIM - 1);
//       // tslint:enable:no-bitwise
//     } else {
//       this.hash = createMaxCoord();
//     }
//
//     this.node = node;
//   }
// }
