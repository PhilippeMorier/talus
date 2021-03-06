import { Coord, createMaxCoord } from '../math';
import { InternalNode1, InternalNode2 } from './internal-node';
import { LeafNode } from './leaf-node';
import { HashableNode } from './node';
import { Tree } from './tree';

/**
 * When traversing a grid by (i, j, k) index in a spatially coherent pattern, such as when
 * iterating over neighboring voxels, request a ValueAccessor from the grid (with Grid.getAccessor)
 * and use the accessor’s `getValue` and `setValue` methods, since these will usually be
 * significantly faster than accessing voxels directly in the grid’s tree. The accessor records
 * the sequence of nodes visited during the most recent access; on the next access, rather than
 * traversing the tree from the root node down, it performs an inverted traversal from the deepest
 * recorded node up. For neighboring voxels, the traversal need only proceed as far as the voxels’
 * common ancestor node, which more often than not is the first node in the sequence.
 * @source: https://www.openvdb.org/documentation/doxygen/overview.html#subsecValueAccessor
 *
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
  private leafKey: Coord = createMaxCoord();
  private leafNode = new LeafNode<T>(this.leafKey);

  private internalKey1: Coord = createMaxCoord();
  private internalNode1 = new InternalNode1<T>(this.internalKey1);

  private internalKey2: Coord = createMaxCoord();
  private internalNode2 = new InternalNode2<T>(this.internalKey2);

  constructor(private tree: Tree<T>) {}

  /**
   * Return true if any of the nodes along the path to the given voxel have been cached.
   */
  isCached(xyz: Coord): boolean {
    return this.isHashed2(xyz) || this.isHashed1(xyz) || this.isHashed0(xyz);
  }

  /**
   * @returns the leaf node that contains voxel (x, y, z)
   * and if it doesn't exist, return undefined.
   */
  probeLeafNode(xyz: Coord): LeafNode<T> | undefined {
    if (this.isHashed0(xyz)) {
      return this.leafNode;
    } else if (this.isHashed1(xyz)) {
      return this.internalNode1.probeLeafNodeAndCache(xyz, this);
    } else if (this.isHashed2(xyz)) {
      return this.internalNode2.probeLeafNodeAndCache(xyz, this);
    } else {
      return this.tree.root.probeLeafNodeAndCache(xyz, this);
    }
  }

  /**
   * @returns the node that contains voxel (x, y, z)
   * and if it doesn't exist, return undefined.
   */
  probeInternalNode1(xyz: Coord): InternalNode1<T> | undefined {
    if (this.isHashed1(xyz)) {
      return this.internalNode1;
    } else if (this.isHashed2(xyz)) {
      return this.internalNode2.probeInternalNode1AndCache(xyz, this);
    } else {
      return this.tree.root.probeInternalNode1AndCache(xyz, this);
    }
  }

  touchLeaf(xyz: Coord): LeafNode<T> | undefined {
    if (this.isHashed0(xyz)) {
      return this.leafNode;
    } else if (this.isHashed1(xyz)) {
      return this.internalNode1.touchLeafAndCache(xyz, this);
    } else if (this.isHashed2(xyz)) {
      return this.internalNode2.touchLeafAndCache(xyz, this);
    } else {
      return this.tree.root.touchLeafAndCache(xyz, this);
    }
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
  setValueOn(xyz: Coord, value: T): void {
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

  /**
   * Set the value of the voxel at the given coordinates and mark the voxel as inactive.
   */
  setValueOff(xyz: Coord, value: T): void {
    if (this.isHashed0(xyz)) {
      this.leafNode.setValueOffAndCache(xyz, value, this);
    } else if (this.isHashed1(xyz)) {
      this.internalNode1.setValueOffAndCache(xyz, value, this);
    } else if (this.isHashed2(xyz)) {
      this.internalNode2.setValueOffAndCache(xyz, value, this);
    } else {
      this.tree.root.setValueOffAndCache(xyz, value, this);
    }
  }

  /**
   * Return the active state of the voxel at the given coordinates.
   */
  isValueOn(xyz: Coord): boolean {
    if (this.isHashed0(xyz)) {
      return this.leafNode.isValueOnAndCache(xyz, this);
    } else if (this.isHashed1(xyz)) {
      return this.internalNode1.isValueOnAndCache(xyz, this);
    } else if (this.isHashed2(xyz)) {
      return this.internalNode2.isValueOnAndCache(xyz, this);
    }
    return this.tree.root.isValueOnAndCache(xyz, this);
  }

  /**
   * Set the active state of the voxel at the given coordinates without changing its value.
   */
  setActiveState(xyz: Coord, on: boolean): void {
    if (this.isHashed0(xyz)) {
      this.leafNode.setActiveStateAndCache(xyz, on, this);
    } else if (this.isHashed1(xyz)) {
      this.internalNode1.setActiveStateAndCache(xyz, on, this);
    } else if (this.isHashed2(xyz)) {
      this.internalNode2.setActiveStateAndCache(xyz, on, this);
    }
    this.tree.root.setActiveStateAndCache(xyz, on, this);
  }

  // tslint:disable:no-bitwise
  insert(xyz: Coord, node: HashableNode<T>): void {
    if (node instanceof LeafNode) {
      this.leafKey.x = xyz.x & LeafNode.DIM_MAX_INDEX_INVERTED;
      this.leafKey.y = xyz.y & LeafNode.DIM_MAX_INDEX_INVERTED;
      this.leafKey.z = xyz.z & LeafNode.DIM_MAX_INDEX_INVERTED;
      this.leafNode = node;
    } else if (node instanceof InternalNode1) {
      this.internalKey1.x = xyz.x & InternalNode1.DIM_MAX_INDEX_INVERTED;
      this.internalKey1.y = xyz.y & InternalNode1.DIM_MAX_INDEX_INVERTED;
      this.internalKey1.z = xyz.z & InternalNode1.DIM_MAX_INDEX_INVERTED;
      this.internalNode1 = node;
    } else if (node instanceof InternalNode2) {
      this.internalKey2.x = xyz.x & InternalNode2.DIM_MAX_INDEX_INVERTED;
      this.internalKey2.y = xyz.y & InternalNode2.DIM_MAX_INDEX_INVERTED;
      this.internalKey2.z = xyz.z & InternalNode2.DIM_MAX_INDEX_INVERTED;
      this.internalNode2 = node;
    }
  }

  private isHashed0(xyz: Coord): boolean {
    return (
      (xyz.x & LeafNode.DIM_MAX_INDEX_INVERTED) === this.leafKey.x &&
      (xyz.y & LeafNode.DIM_MAX_INDEX_INVERTED) === this.leafKey.y &&
      (xyz.z & LeafNode.DIM_MAX_INDEX_INVERTED) === this.leafKey.z
    );
  }

  private isHashed1(xyz: Coord): boolean {
    return (
      (xyz.x & InternalNode1.DIM_MAX_INDEX_INVERTED) === this.internalKey1.x &&
      (xyz.y & InternalNode1.DIM_MAX_INDEX_INVERTED) === this.internalKey1.y &&
      (xyz.z & InternalNode1.DIM_MAX_INDEX_INVERTED) === this.internalKey1.z
    );
  }

  private isHashed2(xyz: Coord): boolean {
    return (
      (xyz.x & InternalNode2.DIM_MAX_INDEX_INVERTED) === this.internalKey2.x &&
      (xyz.y & InternalNode2.DIM_MAX_INDEX_INVERTED) === this.internalKey2.y &&
      (xyz.z & InternalNode2.DIM_MAX_INDEX_INVERTED) === this.internalKey2.z
    );
  }
  // tslint:enable:no-bitwise
}
