import { Grid } from '../grid';
import { CoordBBox, offset } from '../math';
import { VolumeHDDA } from '../math/dda';
import { DELTA } from '../math/math';
import { Ray, TimeSpan } from '../math/ray';
import { ValueAccessor3 } from '../tree/value-accessor';

/**
 * This class provides the public API for intersecting a ray
 * with a generic (e.g. density) volume.
 * Internally it performs the actual hierarchical tree node traversal.
 *
 * Example:
 *
 * // Create an instance for the master thread
 * VolumeRayIntersector inter(grid);
 * // Before each ray-traversal set the index ray.
 * iter.setIndexRay(ray);
 * // or world ray
 * iter.setWorldRay(ray);
 * // Now you can begin the ray-marching using consecutive calls to VolumeRayIntersector::march
 * double t0=0, t1=0;// note the entry and exit times are with respect to the INDEX ray
 * while ( inter.march(t0, t1) ) {
 *   // perform line-integration between t0 and t1
 * }}
 *
 */
export class VolumeRayIntersector<T> {
  private accessor: ValueAccessor3<T> = this.grid.getAccessor();
  private bbox: CoordBBox = new CoordBBox();
  private hdda: VolumeHDDA<T> = new VolumeHDDA<T>();
  private ray: Ray;
  private tMax: number;

  constructor(private grid: Grid<T> /* dilationCount: number = 0 */) {
    // if (!grid.hasUniformVoxels()) {
    //   OPENVDB_THROW(RuntimeError, 'VolumeRayIntersector only supports uniform voxels!');
    // }

    if (this.grid.empty()) {
      throw new Error('VolumeRayIntersector does not supports empty grids');
    }

    // Dilate active voxels to better account for the size of interpolation kernels
    // tools::dilateVoxels(*mTree, dilationCount);

    this.grid.tree.root.evalActiveBoundingBox(this.bbox, false);

    // padding so the bbox of a node becomes (origin,origin + node_dim)
    offset(this.bbox.max, 1);
  }

  /**
   * Return false if the index ray misses the bbox of the grid.
   * @param ray Ray represented in index space.
   * @warning Call this method (or setWorldRay) before the ray
   * traversal starts and use the return value to decide if further
   * marching is required.
   */
  setIndexRay(ray: Ray): boolean {
    this.ray = new Ray(ray.eye, ray.dir, ray.t0, ray.t1);

    const hit = this.ray.clip(this.bbox);
    if (hit) {
      this.tMax = this.ray.t1;
    }

    return hit;
  }

  /**
   * Return true if the ray intersects active values,
   * i.e. either active voxels or tiles. Only when a hit is
   * detected are t0 and t1 updated with the corresponding entry
   * and exit times along the INDEX ray!
   * Note that t0 and t1 are only resolved at the node level
   * (e.g. a LeafNode with active voxels) as opposed to the individual
   * active voxels.
   * @param t0 If the return value > 0 this is the time of the
   * first hit of an active tile or leaf.
   * @param t1 If the return value > t0 this is the time of the
   * first hit (> t0) of an inactive tile or exit point of the
   * BBOX for the leaf nodes.
   * @warning t0 and t1 are computed with respect to the ray represented in
   * index space of the current grid, not world space!
   *
   * We need to pass an object to be able to pass-by-reference.
   * I.e. TimeSpan instead of separate t0 and t1 are passed.
   */
  march(timeSpanRef: TimeSpan): boolean {
    const result = this.marchInternal();
    timeSpanRef.set(result.t0, result.t1);

    return timeSpanRef.valid();
  }

  marchUntilEnd(timeSpanRef: TimeSpan): boolean {
    if (!this.march(timeSpanRef)) {
      return false;
    }

    const t0 = timeSpanRef.t0;
    let t1 = timeSpanRef.t1;

    while (this.march(timeSpanRef)) {
      t1 = timeSpanRef.t1;
    }

    timeSpanRef.set(t0, t1);

    return timeSpanRef.valid();
  }

  private marchInternal(): TimeSpan {
    const t: TimeSpan = this.hdda.marchStart(this.ray, this.accessor);

    if (t.t1 > 0) {
      this.ray.setTimes(t.t1 + DELTA, this.tMax);
    }

    return t;
  }
}
