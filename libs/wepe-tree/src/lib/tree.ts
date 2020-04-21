import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { random, randomInRange } from './random';
import { Stem } from './stem';
import { TreeParam } from './tree-param';

/**
 * Class to store data for the tree
 */
export class Tree {
  constructor(private param: TreeParam, private generateLeaves: boolean) {
    this.stemIndex = 0;

    // Disable leaf generation
    if (!generateLeaves) {
      this.param.leafBlosNum = 0;
    }
  }
  treeScale = 0;
  leavesArray = [];
  branchesCurve;
  baseLength = 0;
  splitNumError = [0, 0, 0, 0, 0, 0, 0];
  stemIndex: number;
  // treeObj = None;
  trunkLength = 0;

  /**
   * Construct the tree
   */
  static construct(params: TreeParam, seed: string, generateLeaves: boolean = true): Tree {
    const newTree = new Tree(params, generateLeaves);
    newTree.make();

    return newTree;
  }

  make(): void {
    // create parent object

    // create branches
    this.createBranches();

    // create leaf mesh if needed and enabled
    if (this.generateLeaves) {
      // self.createLeafMesh();
    }
  }

  /**
   * Create branches for tree
   */
  private createBranches(): void {
    // actually make the branches
    if (this.param.branches[0] > 0) {
      const points = this.pointsForFloorSplit();
    }

    // for (let i = 0; i < this.param.branches[0]; i++) {
    //   this.treeScale = this.param.gScale + randomInRange(-1, 1) * this.param.gScaleV;
    //
    //   // turtle
    // }
  }

  /**
   * Calculate Poissonly distributed points for stem start points
   */
  private pointsForFloorSplit(): [Vector3, number][] {
    const array: [Vector3, number][] = [];

    // calculate approx spacing radius for dummy stem
    this.treeScale = this.param.gScale + this.param.gScaleV;
    const stem = new Stem(0);
    stem.length = this.calcStemLength(stem);
    const rad = 2.5 * this.calcStemRadius(stem);

    // generate points
    this.param.branches.forEach(() => {
      let pointOk = false;

      while (!pointOk) {
        // distance from center proportional for number of splits, tree scale and stem radius
        const dis = Math.sqrt(
          ((random() * this.param.branches[0]) / 2.5) * this.param.gScale * this.param.ratio,
        );

        // angle random in circle
        const theta = randomInRange(0, 2 * Math.PI);
        const pos = new Vector3(dis * Math.cos(theta), dis * Math.sin(theta), 0);

        // test point against those already in array to ensure it will not intersect
        let pointMOk = true;
        for (const point of array) {
          if (point[0].subtract(pos).length() < rad) {
            pointMOk = false;
            break;
          }
        }

        if (pointMOk) {
          pointOk = true;
          array.push([pos, theta]);
        }
      }
    });

    return array;
  }

  /**
   * Calculate length of this stem as defined in paper
   */
  private calcStemLength(stem: Stem): number {
    let result = 0;
    // trunk
    if (stem.depth === 0) {
      result =
        this.treeScale * (this.param.length[0] + randomInRange(-1, 1) * this.param.lengthV[0]);
      this.trunkLength = result;
    } else if (stem.depth === 1) {
      if (!stem.parent) {
        throw new Error('Stem needs to have a parent.');
      }

      result =
        stem.parent.length *
        stem.parent.lengthChildMax *
        this.shapeRatio(
          this.param.shape,
          (stem.parent.length - stem.offset) / (stem.parent.length - this.baseLength),
        );
    } else {
      if (!stem.parent) {
        throw new Error('Stem needs to have a parent.');
      }

      result = stem.parent.lengthChildMax * (stem.parent.length - 0.7 * stem.offset);
    }

    return Math.max(0, result);
  }

  /**
   * Calculate shape ratio as defined in paper
   */
  private shapeRatio(shape: number, ratio: number): number {
    let result: number;

    if (shape === 1) {
      // spherical
      result = 0.2 + 0.8 * Math.sin(Math.PI * ratio);
    } else if (shape === 2) {
      // hemispherical
      result = 0.2 + 0.8 * Math.sin(0.5 * Math.PI * ratio);
    } else if (shape === 3) {
      // cylindrical
      result = 1.0;
    } else if (shape === 4) {
      // tapered cylindrical
      result = 0.5 + 0.5 * ratio;
    } else if (shape === 5) {
      // flame
      result = ratio <= 0.7 ? ratio / 0.7 : (1.0 - ratio) / 0.3;
    } else if (shape === 6) {
      // inverse conical
      result = 1.0 - 0.8 * ratio;
    } else if (shape === 7) {
      // tend flame
      result = ratio <= 0.7 ? 0.5 + (0.5 * ratio) / 0.7 : 0.5 + (0.5 * (1.0 - ratio)) / 0.3;
    } else if (shape === 8) {
      // envelope
      if (ratio < 0 || ratio > 1) {
        result = 0.0;
      } else if (ratio < 1 - this.param.pruneWidthPeak) {
        result = Math.pow(ratio / (1 - this.param.pruneWidthPeak), this.param.prunePowerHigh);
      } else {
        result = Math.pow((1 - ratio) / (1 - this.param.pruneWidthPeak), this.param.prunePowerLow);
      }
    } else {
      // conical (0)
      result = 0.2 + 0.8 * ratio;
    }

    return result;
  }

  /**
   * Calculate radius of this stem as defined in paper
   */
  private calcStemRadius(stem: Stem): number {
    let result: number;

    if (stem.depth === 0) {
      // trunk
      result = stem.length * this.param.ratio * this.param.radiusMod[0];
    } else {
      if (!stem.parent) {
        throw new Error('Stem needs to have a parent.');
      }

      // other
      result =
        this.param.radiusMod[stem.depth] *
        stem.parent.radius *
        Math.pow(stem.length / stem.parent.length, this.param.ratioPower);
      result = Math.max(0.005, result);
      result = Math.min(stem.radiusLimit, result);
    }

    return result;
  }
}
