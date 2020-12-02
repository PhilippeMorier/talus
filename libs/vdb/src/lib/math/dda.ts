import { LeafNode, ValueAccessor3 } from '../tree';
import { Index } from '../types';
import { Coord, createMaxCoord, floor } from './coord';
import { Ray, TimeSpan } from './ray';
import { Vec3 } from './vec3';

/**
 * @brief A Digital Differential Analyzer specialized for OpenVDB grids
 * @note Conceptually similar to Bresenham's line algorithm applied
 * to a 3D Ray intersecting OpenVDB nodes or voxels. Log2Dim = 0
 * corresponds to a voxel and Log2Dim a tree node of size 2^Log2Dim.
 *
 * @note The Ray template class is expected to have the following
 * methods: test(time), t0(), t1(), invDir(), and  operator()(time).
 * See the example Ray class above for their definition.
 */
export class DDA {
  private readonly DIM = 1 << this.log2Dim;

  private t0 = -1;
  private t1 = -1;

  private voxel: Coord = createMaxCoord();
  private step: Coord = createMaxCoord();

  private next: Vec3 = Vec3.Zero;
  private delta: Vec3 = Vec3.Zero;

  /**
   * @param log2Dim originally a configurable template parameter
   */
  constructor(private readonly log2Dim: Index) {}

  /**
   * @brief Return the time (parameterized along the Ray) of the
   * first hit of a tree node of size 2^Log2Dim.
   * @details This value is initialized to startTime or ray.t0()
   * depending on the constructor used.
   */
  getTime(): number {
    return this.t0;
  }

  // @brief Return the maximum time (parameterized along the Ray).
  getMaxTime(): number {
    return this.t1;
  }

  getVoxel(): Coord {
    return { x: this.voxel.x, y: this.voxel.y, z: this.voxel.z };
  }

  init(ray: Ray, startTime: number, maxTime: number): void {
    if (startTime > maxTime) {
      throw new Error('Start time must be smaller or equal the max time.');
    }

    this.t0 = startTime;
    this.t1 = maxTime;

    const pos = ray.calcPositionAlongRayAtTime(this.t0);
    const dir = ray.dir;
    const inv = ray.invDir;

    this.voxel = floor(pos.toCoord());
    this.voxel.x &= ~(this.DIM - 1);
    this.voxel.y &= ~(this.DIM - 1);
    this.voxel.z &= ~(this.DIM - 1);

    Vec3.Axes.forEach(axis => {
      // handles dir = +/- 0
      if (dir[axis] === 0) {
        this.step[axis] = 0; // dummy value
        this.next[axis] = Number.MAX_SAFE_INTEGER; // i.e. disabled!
        this.delta[axis] = Number.MAX_SAFE_INTEGER; // dummy value
      } else if (inv[axis] > 0) {
        this.step[axis] = this.DIM;
        this.next[axis] = this.t0 + (this.voxel[axis] + this.DIM - pos[axis]) * inv[axis];
        this.delta[axis] = this.step[axis] * inv[axis];
      } else {
        this.step[axis] = -this.DIM;
        this.next[axis] = this.t0 + (this.voxel[axis] - pos[axis]) * inv[axis];
        this.delta[axis] = this.step[axis] * inv[axis];
      }
    });
  }

  /**
   * @brief Increment the voxel index to next intersected voxel or node
   * and returns true if the step in time does not exceed maxTime.
   */
  nextStep(): boolean {
    const stepAxis = this.next.minIndex();

    this.t0 = this.next[stepAxis];
    this.next[stepAxis] += this.delta[stepAxis];
    this.voxel[stepAxis] += this.step[stepAxis];

    return this.t0 <= this.t1;
  }
}

/**
 * @brief Specialization of Hierarchical Digital Differential Analyzer
 * class that intersects against the leafs or tiles of a generic volume.
 */
export class VolumeHDDA<T> {
  private dda = new DDA(LeafNode.LOG2DIM);

  marchStart(ray: Ray, acc: ValueAccessor3<T>): TimeSpan {
    const tRef = new TimeSpan(-1, -1);

    if (ray.valid()) {
      this.march(ray, acc, tRef);
    }

    return tRef;
  }

  // ListType is a list of RayType::TimeSpan and is required to
  // have the two methods: clear() and push_back(). Thus, it could
  // be std::vector<typename RayType::TimeSpan> or
  // std::deque<typename RayType::TimeSpan>.
  hitsStart(ray: Ray, acc: ValueAccessor3<T>, times: TimeSpan[]): void {
    const t = new TimeSpan(-1, -1);
    times = [];

    this.hits(ray, acc, times, t);

    if (t.valid()) {
      times.push(t);
    }
  }

  private march(ray: Ray, acc: ValueAccessor3<T>, t: TimeSpan): boolean {
    this.dda.init(ray, ray.t0, ray.t1);

    do {
      // hit a leaf or an active tile
      if (acc.probeLeafNode(this.dda.getVoxel()) || acc.isValueOn(this.dda.getVoxel())) {
        // this is the first hit
        if (t.t0 < 0) {
          t.t0 = this.dda.getTime();
        }
      } else if (t.t0 >= 0) {
        // hit an inactive tile after hitting active values
        // set end of active ray segment
        t.t1 = this.dda.getTime();
        if (t.valid()) {
          // terminate
          return true;
        }

        // reset to an empty and invalid time-span
        t.set(-1, -1);
      }
    } while (this.dda.nextStep());

    if (t.t0 >= 0) {
      t.t1 = this.dda.getMaxTime();
    }

    return false;
  }

  hits(ray: Ray, acc: ValueAccessor3<T>, times: TimeSpan[], t: TimeSpan): void {
    this.dda.init(ray, ray.t0, ray.t1);

    do {
      // hit a leaf or an active tile
      if (acc.probeLeafNode(this.dda.getVoxel()) || acc.isValueOn(this.dda.getVoxel())) {
        // this is the first hit
        if (t.t0 < 0) {
          t.t0 = this.dda.getTime();
        }
      } else if (t.t0 >= 0) {
        // hit an inactive tile after hitting active values
        // set end of active ray segment
        t.t1 = this.dda.getTime();
        if (t.valid()) {
          times.push(t);
        }
        // reset to an empty and invalid time-span
        t.set(-1, -1);
      }
    } while (this.dda.nextStep());

    if (t.t0 >= 0) {
      t.t1 = this.dda.getMaxTime();
    }
  }
}
