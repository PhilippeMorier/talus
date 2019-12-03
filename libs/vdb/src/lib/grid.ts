import { ValueType } from './tree/leaf-node';
import { Tree } from './tree/tree';
import { ValueAccessor3 } from './tree/value-accessor';

/**
 *  Grid, a container that associates a Tree with a Transform and additional metadata.
 *  For instancing purposes (i.e., placing copies of the same volume in multiple locations),
 *  the same tree may be referenced by several different Grids, each having a unique transform.
 *
 *  A Grid contains smart pointers to a Tree object and a Transform object, either or both
 *  of which might be shared with other grids. As mentioned above, the transform provides
 *  for the interpretation of voxel locations. Other grid metadata, notably the grid class,
 *  the vector type and the world space/local space toggle, affect the interpretation of
 *  voxel values.
 *
 *  Source: https://www.openvdb.org/documentation/doxygen/overview.html
 */
export class Grid<T = ValueType> {
  readonly tree: Tree<T>;

  constructor(background: T) {
    this.tree = new Tree<T>(background);
  }

  /**
   * Return an accessor that provides random read and write access to this grid's voxels.
   */
  getAccessor(): ValueAccessor3<T> {
    return new ValueAccessor3(this.tree);
  }

  get background(): T {
    return this.tree.background;
  }
}
