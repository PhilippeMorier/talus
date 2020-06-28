import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Tools } from '@babylonjs/core/Misc/tools';
import { Leaf } from './leaf';
import { getNumberGeneratorState, random, randomInRange, setNumberGeneratorState } from './random';
import { BezierPoint, radiusAtOffset, scaleBezierHandlesForFlare, Stem } from './stem';
import { TreeParam } from './tree-param';
import { applyTropism, calcHelixPoints, Turtle } from './turtle';
import { calcDeclination, calcPointOnBezier, calcTangentToBezier } from './vector';

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
  leavesArray: Leaf[] = [];
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
      this.createLeafMesh();
    }
  }

  /**
   * Create branches for tree
   */
  private createBranches(): void {
    // actually make the branches
    let points: [Vector3, number][] = [];
    if (this.param.branches[0] > 0) {
      points = this.pointsForFloorSplit();
    }

    for (let ind = 0; ind < this.param.branches[0]; ind++) {
      this.treeScale = this.param.gScale + randomInRange(-1, 1) * this.param.gScaleV;

      const turtle = new Turtle();

      if (this.param.branches[0] > 1) {
        // position randomly at base and rotate to face out
        const point = points[ind];
        turtle.rollRight(point[1] - Math.PI / 2);
        turtle.pos = point[0];
      } else {
        // start at random rotation
        turtle.rollRight(randomInRange(0, Math.PI * 2));
      }

      // trunk = self.branches_curve.splines.new('BEZIER')
      // trunk.radius_interpolation = 'CARDINAL'
      // trunk.resolution_u = 2

      this.makeStem(turtle, new Stem(0 /*, trunk*/));
    }
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
        const theta = randomInRange(0, Math.PI * 2);
        // Todo: swap y with z due to Blender & Babylonjs having different up-vector
        const pos = new Vector3(dis * Math.cos(theta), 0, dis * Math.sin(theta));

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

  /**
   * Generate stem given parameters, as well as all children (branches, splits and leaves)
   * via recursion
   */
  private makeStem(
    turtle: Turtle,
    stem: Stem,
    start: number = 0,
    splitCorrAngle: number = 0,
    numBranchesFactor: number = 1,
    cloneProb: number = 1,
    posCorrTurtle?: Turtle,
    clonedTurtle?: Turtle,
  ): void {
    // if the stem is so thin as to be invisible then don't bother to make it
    if (0 <= stem.radiusLimit && stem.radiusLimit < 0.0001) {
      return;
    }

    // use level 3 parameters for any depth greater than this
    const depth = stem.depth;
    let dPlus1 = depth + 1;
    if (dPlus1 > 3) {
      dPlus1 = 3;
    }

    // calc length and radius for this stem (only applies for non clones)
    if (start === 0) {
      stem.lengthChildMax =
        this.param.length[dPlus1] + randomInRange(-1, 1) * this.param.lengthV[dPlus1];
      stem.length = this.calcStemLength(stem);
      stem.radius = this.calcStemRadius(stem);

      if (depth === 0) {
        this.baseLength = stem.length * this.param.baseSize[0];
      }
    }

    // if the branch origin needs to be repositioned so bevel doesnt sit outside parent
    if (posCorrTurtle) {
      // posCorrTurtle currently positioned on circumference so subtract this branch radius
      // to ensure open ends are never visible
      posCorrTurtle.move(-Math.min(stem.radius, stem.radiusLimit));
      turtle.pos = posCorrTurtle.pos;
    }

    // apply pruning, not required if is a clone, as this will have been tested already
    if (!clonedTurtle && this.param.pruneRatio > 0) {
      // save start length and random state
      const startLength = stem.length;
      const rState = getNumberGeneratorState();
      const splitErrState = [...this.splitNumError];

      // iteratively scale length by 0.9 until it fits, or remove entirely if we get to 80%
      // reduction
      let inPruningEnvelope = this.testStem(
        new Turtle(turtle),
        stem,
        start,
        splitCorrAngle,
        cloneProb,
      );
      while (!inPruningEnvelope) {
        stem.length *= 0.9;
        if (stem.length < 0.15 * startLength) {
          // too short to look good so remove allow for semi prune with 0 length
          if (this.param.pruneRatio < 1) {
            stem.length = 0;
            break;
          } else {
            return;
          }
        }

        setNumberGeneratorState(rState);
        this.splitNumError = splitErrState;
        inPruningEnvelope = this.testStem(
          new Turtle(turtle),
          stem,
          start,
          splitCorrAngle,
          cloneProb,
        );
      }

      const fittingLength = stem.length;
      // apply reduction scaled by prune ratio
      stem.length =
        startLength * (1 - this.param.pruneRatio) + fittingLength * this.param.pruneRatio;
      // recalculate stem radius for new length
      stem.radius = this.calcStemRadius(stem);
      // restore random state
      setNumberGeneratorState(rState);
      this.splitNumError = splitErrState;
    }

    // get parameters
    const curveRes = Math.trunc(this.param.curveRes[depth]);
    const segSplits = this.param.segSplits[depth];
    const segLength = stem.length / curveRes;

    // calc base segment
    const baseSegInd = Math.ceil(this.param.baseSize[0] * Math.trunc(this.param.curveRes[0]));

    let leafCount = 0;
    let branchCount = 0;
    let fLeavesOnSeg = 0;
    let fBranchesOnSeg = 0;
    if (depth === this.param.levels - 1 && depth > 0 && this.param.leafBlosNum !== 0) {
      // calc base leaf count
      leafCount = this.calcLeafCount(stem);
      // correct leaf count for start position along stem
      leafCount *= 1 - start / curveRes;
      // divide by curveRes to get no per seg
      fLeavesOnSeg = leafCount / curveRes;
    } else {
      // calc base branch count
      branchCount = this.calcBranchCount(stem);
      // correct branch Count for start position along stem
      branchCount *= 1 - start / curveRes;
      // correct for reduced number on clone branches
      branchCount *= numBranchesFactor;
      // divide by curveRes to get no per seg
      fBranchesOnSeg = branchCount / curveRes;
    }

    // higher point resolution for flared based
    const maxPointsPerSeg = Math.ceil(Math.max(1.0, 100 / curveRes));

    // set up FS error values
    let branchNumError = 0;
    let leafNumError = 0;

    // decide on start rotation for branches/leaves
    // use array to allow other methods to modify the value (otherwise passed by value)
    const prevRotationAngle = [0];
    if (this.param.rotate[dPlus1] >= 0) {
      // start at random rotation
      prevRotationAngle[0] = randomInRange(0, 360);
    } else {
      // on this case prevRotationAngle used as multiplier to alternate side of branch
      prevRotationAngle[0] = 1;
    }

    // calc helix parameters if needed
    let helP0 = Vector3.Zero();
    let helP1 = Vector3.Zero();
    let helP2 = Vector3.Zero();
    let helAxis = Vector3.Zero();
    if (this.param.curveV[depth] < 0) {
      const tanAng = Math.tan(Tools.ToRadians(90 - Math.abs(this.param.curveV[depth])));
      const helPitch = ((2 * stem.length) / curveRes) * randomInRange(0.8, 1.2);
      const helRadius = ((3 * helPitch) / (16 * tanAng)) * randomInRange(0.8, 1.2);

      // apply full tropism if not trunk/main branch and horizontal tropism if is
      if (depth > 1) {
        applyTropism(turtle, this.param.tropism);
      } else {
        applyTropism(turtle, new Vector3(this.param.tropism[0], this.param.tropism[1], 0));
      }

      [helP0, helP1, helP2, helAxis] = calcHelixPoints(turtle, helRadius, helPitch);
    }

    // point resolution for this seg, maxPointsPerSeg if base, 1 otherwise
    const pointsPerSeg = depth === 0 || this.param.taper[depth] > 1 ? maxPointsPerSeg : 2;

    for (let segInd = start; segInd < curveRes + 1; segInd++) {
      const remainingSegs = curveRes + 1 - segInd;

      // set up next bezier point
      const pos = turtle.pos;
      let newPoint = new BezierPoint();
      if (this.param.curveV[depth] < 0) {
        // negative curveV so helix branch
        if (segInd === 0) {
          // TODO: we save all bezier points in a list and create at the end all cubic Bezier curve
          newPoint.controlPoint = pos.clone();
          newPoint.handleRight = helP0.add(pos);
          newPoint.handleLeft = pos.clone();

          stem.bezierPoints.push(newPoint);
        } else {
          if (segInd === 1) {
            newPoint.controlPoint = helP2.add(pos);
            newPoint.handleLeft = helP1.add(pos);
            newPoint.handleRight = newPoint.controlPoint.scale(2).subtract(newPoint.handleLeft);
          } else {
            const prevPoint = stem.bezierPoints[stem.bezierPoints.length - 1];
            const rotQuat = Quaternion.RotationAxis(helAxis, (segInd - 1) * Math.PI);
            helP2.rotateByQuaternionToRef(rotQuat, newPoint.controlPoint);
            newPoint.controlPoint.add(prevPoint.controlPoint);

            const difP = Vector3.Zero();
            helP2.subtract(helP1).rotateByQuaternionToRef(rotQuat, difP);
            newPoint.handleLeft = newPoint.controlPoint.subtract(difP);
            newPoint.handleRight = newPoint.controlPoint.scale(2).subtract(newPoint.handleLeft);
          }
        }

        turtle.pos = newPoint.controlPoint.clone();
        turtle.dir = newPoint.handleRight.clone().normalize();
      } else {
        // normal curved branch
        // get/make new point to be modified
        if (segInd === start) {
          newPoint = stem.bezierPoints[0];
        } else {
          turtle.move(segLength);
          stem.bezierPoints.push(new BezierPoint());
          newPoint = stem.bezierPoints[-1];
        }

        // set position and handles of new point
        // if this is a clone then correct initial direction to match original to make
        // split smoother
        newPoint.controlPoint = turtle.pos.clone();
        const scaleFactor = stem.length / (curveRes * 3);
        if (clonedTurtle && segInd === start) {
          newPoint.handleLeft = turtle.pos.subtract(clonedTurtle.dir.scale(scaleFactor));
          newPoint.handleRight = turtle.pos.add(clonedTurtle.dir.scale(scaleFactor));
        } else {
          newPoint.handleLeft = turtle.pos.subtract(turtle.dir.scale(scaleFactor));
          newPoint.handleRight = turtle.pos.add(turtle.dir.scale(scaleFactor));
        }
      }

      // set radius of new point
      const actualRadius = radiusAtOffset(
        stem,
        segInd / curveRes,
        this.param.taper[stem.depth],
        this.param.flare,
      );
      newPoint.radius = actualRadius;

      if (segInd > start) {
        // calc number of splits at this seg (N/A for helix)
        let numOfSplits = 0;
        if (this.param.curveV[depth] >= 0) {
          if (this.param.baseSplits > 0 && depth === 0 && segInd === baseSegInd) {
            // if baseSegInd and has base splits then override with base split number
            // take random number of splits up to max of baseSplits if negative
            if (this.param.baseSplits < 0) {
              numOfSplits = Math.trunc(random() * (Math.abs(this.param.baseSplits) + 0.5));
            } else {
              numOfSplits = Math.trunc(this.param.baseSplits);
            }
          } else if (segSplits > 0 && segInd < curveRes && (depth > 0 || segInd > baseSegInd)) {
            // otherwise get number of splits from segSplits and use floyd-steinberg to
            // fix non-integer values only clone with probability cloneProb
            if (random() <= cloneProb) {
              numOfSplits = Math.trunc(segSplits + this.splitNumError[depth]);
              this.splitNumError[depth] -= numOfSplits - segSplits;

              // reduce clone/branch propensity
              cloneProb /= numOfSplits + 1;
              numBranchesFactor /= numOfSplits + 1;
              numBranchesFactor = Math.max(0.8, numBranchesFactor);

              // TODO do this better?
              // if depth != this.param.levels - 1:
              branchCount *= numBranchesFactor;
              fBranchesOnSeg = branchCount / curveRes;
            }
          }
        }

        // add branches/leaves for this seg
        // if below max level of recursion then draw branches, otherwise draw leaves
        let rState = getNumberGeneratorState();
        if (Math.abs(branchCount) > 0 && depth < this.param.levels - 1) {
          let branchesOnSeg: number;

          if (branchCount < 0) {
            // fan branches
            if (segInd === curveRes) {
              branchesOnSeg = Math.trunc(branchCount);
            } else {
              branchesOnSeg = 0;
            }
          } else {
            // get FS corrected branch number
            branchesOnSeg = Math.trunc(fBranchesOnSeg + branchNumError);
            branchNumError -= branchesOnSeg - fBranchesOnSeg;
          }

          // add branches
          if (Math.abs(branchesOnSeg) > 0) {
            this.makeBranches(turtle, stem, segInd, branchesOnSeg, prevRotationAngle);
          }
        } else if (Math.abs(leafCount) > 0 && depth > 0) {
          let leavesOnSeg: number;
          if (leafCount < 0) {
            // fan leaves
            if (segInd === curveRes) {
              leavesOnSeg = leafCount;
            } else {
              leavesOnSeg = 0;
            }
          } else {
            // get FS corrected number of leaves
            leavesOnSeg = Math.trunc(fLeavesOnSeg + leafNumError);
            leafNumError -= leavesOnSeg - fLeavesOnSeg;
          }

          // add leaves
          if (Math.abs(leavesOnSeg) > 0) {
            this.makeLeaves(turtle, stem, segInd, leavesOnSeg, prevRotationAngle);
          }
        }

        setNumberGeneratorState(rState);

        // perform cloning if needed, not allowed for helix
        // (also don't curve/apply tropism as irrelevant)
        if (this.param.curveV[depth] >= 0) {
          if (numOfSplits > 0) {
            // calc angles for split
            const isBaseSplit = this.param.baseSplits > 0 && depth === 0 && segInd === baseSegInd;
            const usingDirectSplit = this.param.splitAngle[depth] < 0;

            let sprAngle: number;
            let splAngle: number;
            if (usingDirectSplit) {
              sprAngle =
                Math.abs(this.param.splitAngle[depth]) +
                randomInRange(-1, 1) * this.param.splitAngleV[depth];
              splAngle = 0;
              splitCorrAngle = 0;
            } else {
              const declination = calcDeclination(turtle.dir);
              splAngle =
                this.param.splitAngle[depth] +
                randomInRange(-1, 1) * this.param.splitAngleV[depth] -
                declination;
              splAngle = Math.max(0, splAngle);
              splitCorrAngle = splAngle / remainingSegs;
              sprAngle = -(20 + 0.75 * (30 + Math.abs(declination - 90) * random() ** 2));
            }

            // make clone branches
            rState = getNumberGeneratorState();
            this.makeClones(
              turtle,
              segInd,
              splitCorrAngle,
              numBranchesFactor,
              cloneProb,
              stem,
              numOfSplits,
              splAngle,
              sprAngle,
              isBaseSplit,
            );
            setNumberGeneratorState(rState);

            // apply split to base stem
            turtle.pitchDown(splAngle / 2);

            // apply spread if splitting to 2 and not base split
            if (!isBaseSplit && numOfSplits === 1) {
              if (usingDirectSplit) {
                turtle.turnRight(sprAngle / 2);
              } else {
                const rotQuat = Quaternion.RotationAxis(
                  new Vector3(0, 0, 1),
                  Tools.ToRadians(-sprAngle / 2),
                );
                turtle.dir.rotateByQuaternionToRef(rotQuat, turtle.dir);
                turtle.dir.normalize();
                turtle.right.rotateByQuaternionToRef(rotQuat, turtle.right);
                turtle.right.normalize();
              }
            }
          } else {
            // just apply curve and split correction
            turtle.turnLeft((randomInRange(-1, 1) * this.param.bendV[depth]) / curveRes);
            const curveAngle = this.calcCurveAngle(depth, segInd);
            turtle.pitchDown(curveAngle - splitCorrAngle);
          }

          // apply full tropism if not trunk/main branch and horizontal tropism if is
          if (depth > 1) {
            applyTropism(turtle, this.param.tropism.clone());
          } else {
            // TODO: swapped y with z
            applyTropism(turtle, new Vector3(this.param.tropism[0], 0, this.param.tropism[1]));
          }
        }

        // increase point resolution at base of trunk and apply flaring effect
        if (pointsPerSeg > 2) {
          this.increaseBezierPointRes(stem, segInd, pointsPerSeg);
        }
      }
    }

    // scale down bezier point handles for flared base of trunk
    if (pointsPerSeg > 2) {
      scaleBezierHandlesForFlare(stem, maxPointsPerSeg);
    }

    this.stemIndex += 1;
  }

  /**
   * Test if stem is inside pruning envelope
   */
  private testStem(
    turtle: Turtle,
    stem: Stem,
    start: number,
    splitCorrAngle: number,
    cloneProb: number,
  ): boolean {
    // use level 3 parameters for any depth greater than this
    const depth = stem.depth;
    let dPlus1 = depth + 1;
    if (dPlus1 > 3) {
      dPlus1 = 3;
    }

    // get parameters
    const curveRes = Math.trunc(this.param.curveRes[depth]);
    const segSplits = this.param.segSplits[depth];
    const segLength = stem.length / curveRes;

    // calc base segment
    const baseSegInd = Math.ceil(this.param.baseSize[0] * Math.trunc(this.param.curveRes[0]));

    // decide on start rotation for branches/leaves
    // use array to allow other methods to modify the value (otherwise passed by value)
    const prevRotationAngle = [0];
    if (this.param.rotate[dPlus1] >= 0) {
      // start at random rotation
      prevRotationAngle[0] = randomInRange(0, Math.PI * 2); // TODO: check ° vs rad
    } else {
      // on this case prevRotationAngle used as multiplier to alternate side of branch
      prevRotationAngle[0] = 1;
    }

    // calc helix parameters if needed
    let helP2, helAxis, previousHelixPoint;
    if (this.param.curveV[depth] < 0) {
      const tanAng = Math.tan(Math.PI / 2 - Math.abs(this.param.curveV[depth]));
      const helPitch = ((2 * stem.length) / curveRes) * randomInRange(0.8, 1.2);
      const helRadius = ((3 * helPitch) / (16 * tanAng)) * randomInRange(0.8, 1.2);
      // apply full tropism if not trunk/main branch and horizontal tropism if is
      if (depth > 1) {
        applyTropism(turtle, this.param.tropism);
      } else {
        // TODO: y with z swapped
        applyTropism(turtle, new Vector3(this.param.tropism[0], 0, this.param.tropism[1]));
      }

      [, , helP2, helAxis] = calcHelixPoints(turtle, helRadius, helPitch);
    }

    for (let segInd = start; segInd < curveRes + 1; segInd++) {
      const remainingSegs = curveRes + 1 - segInd;

      // set up next bezier point
      if (this.param.curveV[depth] < 0) {
        // negative curveV so helix branch
        const pos = turtle.pos.clone();
        if (segInd === 0) {
          turtle.pos = pos;
        } else if (segInd === 1) {
          turtle.pos = helP2 + pos;
        } else {
          helP2.rotateByQuaternionToRef(
            Quaternion.RotationAxis(helAxis, (segInd - 1) * Math.PI),
            helP2,
          );
          turtle.pos = helP2 + previousHelixPoint;
        }
        previousHelixPoint = turtle.pos.clone();
      } else if (segInd !== start) {
        // normal curved branch
        // move turtle
        turtle.move(segLength);
        if (!(stem.depth === 0 && start < baseSegInd) && !this.pointInside(turtle.pos)) {
          return false;
        }
      }

      if (segInd > start) {
        // calc number of splits at this seg (N/A for helix)
        if (this.param.curveV[depth] >= 0) {
          let numOfSplits = 0;
          if (this.param.baseSplits > 0 && depth === 0 && segInd === baseSegInd) {
            // if baseSegInd and has base splits then override with base split number
            // take random number of splits up to max of baseSplits
            numOfSplits = Math.trunc(random() * (this.param.baseSplits + 0.5));
          } else if (segSplits > 0 && segInd < curveRes && (depth > 0 || segInd > baseSegInd)) {
            // otherwise get number of splits from segSplits and use Floyd-Steinberg to
            // fix non-integer values only clone with probability cloneProb
            if (random() <= cloneProb) {
              numOfSplits = Math.trunc(segSplits + this.splitNumError[depth]);
              this.splitNumError[depth] -= numOfSplits - segSplits;
              // reduce clone/branch propensity
              cloneProb /= numOfSplits + 1;
            }
          }

          // perform cloning if needed, not allowed for helix
          // (also don't curve/apply tropism as irrelevant)
          if (numOfSplits > 0) {
            // calc angles for split
            const isBaseSplit = this.param.baseSplits > 0 && depth === 0 && segInd === baseSegInd;
            const usingDirectSplit = this.param.splitAngle[depth] < 0;
            let sprAngle: number;
            let splAngle: number;
            if (usingDirectSplit) {
              sprAngle =
                Math.abs(this.param.splitAngle[depth]) +
                randomInRange(-1, 1) * this.param.splitAngleV[depth];
              splAngle = 0;
              splitCorrAngle = 0;
            } else {
              const declination = calcDeclination(turtle.dir);
              splAngle =
                this.param.splitAngle[depth] +
                randomInRange(-1, 1) * this.param.splitAngleV[depth] -
                declination;
              splAngle = Math.max(0, splAngle);
              splitCorrAngle = splAngle / remainingSegs;
              sprAngle = -(20 + 0.75 * (30 + Math.abs(declination - 90) * random() ** 2));
            }

            // apply split to base stem
            turtle.pitchDown(splAngle / 2);
            // apply spread if splitting to 2 and not base split
            if (!isBaseSplit && numOfSplits === 1) {
              if (usingDirectSplit) {
                turtle.turnLeft(sprAngle / 2);
              } else {
                const rotQuat = Quaternion.RotationAxis(
                  // TODO: swapped y with z
                  new Vector3(0, 1, 0),
                  Tools.ToRadians(-sprAngle / 2),
                );
                turtle.dir.rotateByQuaternionToRef(rotQuat, turtle.dir);
                turtle.dir.normalize();
                turtle.right.rotateByQuaternionToRef(rotQuat, turtle.right);
                turtle.right.normalize();
              }
            }
          } else {
            // just apply curve and split correction
            turtle.turnLeft((randomInRange(-1, 1) * this.param.bendV[depth]) / curveRes);
            const curveAngle = this.calcCurveAngle(depth, segInd);
            turtle.pitchDown(curveAngle - splitCorrAngle);
          }

          // apply full tropism if not trunk/main branch and horizontal tropism if is
          if (depth > 1) {
            applyTropism(turtle, this.param.tropism.clone());
          } else {
            // TODO: swapped y with z
            applyTropism(turtle, new Vector3(this.param.tropism[0], 0, this.param.tropism[1]));
          }
        }
      }
    }

    return this.pointInside(turtle.pos);
  }

  /**
   * Check if point == inside pruning envelope, from Weber/Penn Chapter 4.6
   */
  private pointInside(point: Vector3): boolean {
    // TODO: changed line since in Weber/Penn it is sqrt(x**2 + y**2, z**2)
    // const dist = Math.sqrt(point.x ** 2 + point.y);
    const dist = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
    // TODO: replaced z with y (up-vector)
    // const ratio = (this.treeScale - point.z) / (this.treeScale * (1 - this.param.baseSize[0]));
    const ratio = (this.treeScale - point.y) / (this.treeScale * (1 - this.param.baseSize[0]));
    const inside = dist / this.treeScale < this.param.pruneWidth * this.shapeRatio(8, ratio);

    return inside;
  }

  /**
   * Calculate curve angle for segment number segInd on a stem
   */
  private calcCurveAngle(depth: number, segInd: number): number {
    const curve = this.param.curve[depth];
    const curveV = this.param.curveV[depth];
    const curveBack = this.param.curveBack[depth];
    const curveRes = Math.trunc(this.param.curveRes[depth]);
    let curveAngle: number;

    if (curveBack === 0) {
      curveAngle = curve / curveRes;
    } else {
      if (segInd < curveRes / 2.0) {
        curveAngle = curve / (curveRes / 2.0);
      } else {
        curveAngle = curveBack / (curveRes / 2.0);
        curveAngle += randomInRange(-1, 1) * (curveV / curveRes);
      }
    }

    return curveAngle;
  }

  /**
   * Make the required branches for a segment of the stem
   */
  private makeBranches(
    turtle: Turtle,
    stem: Stem,
    segInd: number,
    branchesOnSeg: number,
    prevRotationAngle: number[],
    isLeaves: boolean = false,
  ): void {
    const startPoint = stem.bezierPoints[stem.bezierPoints.length - 2];
    const endPoint = stem.bezierPoints[stem.bezierPoints.length - 1];
    const branchesArray: [Turtle, Turtle, number, number][] = [];
    const dPlus1 = Math.min(3, stem.depth + 1);

    // fan branches
    if (branchesOnSeg < 0) {
      for (let branchInd = 0; branchInd < Math.abs(Math.trunc(branchesOnSeg)); branchInd++) {
        const stemOffset = 1;
        branchesArray.push(
          this.setUpBranch(
            turtle,
            stem,
            BranchMode.Fan,
            1,
            startPoint,
            endPoint,
            stemOffset,
            branchInd,
            prevRotationAngle,
            Math.abs(branchesOnSeg),
          ),
        );
      }
    } else {
      const baseLength = stem.length * this.param.baseSize[stem.depth];
      const branchDist = this.param.branchDist[dPlus1];
      const curveRes = Math.trunc(this.param.curveRes[stem.depth]);

      if (branchDist > 1) {
        // whorled branches
        // calc number of whorls, will result in a rounded number of branches rather than the
        // exact amount specified by branchesOnSeg

        const numOfWhorls = Math.trunc(branchesOnSeg / (branchDist + 1));
        const branchesPerWhorl = branchDist + 1;
        let branchWhorlError = 0;

        for (let whorlNum = 0; whorlNum < numOfWhorls; whorlNum++) {
          // calc whorl offset in segment and on stem
          const offset = Math.min(Math.max(0.0, whorlNum / numOfWhorls), 1.0);
          const stemOffset = ((segInd - 1 + offset) / curveRes) * stem.length;

          // if not in base area then make the branches
          if (stemOffset > baseLength) {
            // calc FS corrected num of branches this whorl
            const branchesThisWhorl = Math.trunc(branchesPerWhorl + branchWhorlError);
            branchWhorlError -= branchesThisWhorl - branchesPerWhorl;

            // set up these branches
            for (let branchInd = 0; branchInd < branchesThisWhorl; branchInd++) {
              branchesArray.push(
                this.setUpBranch(
                  turtle,
                  stem,
                  BranchMode.Whorled,
                  offset,
                  startPoint,
                  endPoint,
                  stemOffset,
                  branchInd,
                  prevRotationAngle,
                  branchesThisWhorl,
                ),
              );
            }
          }

          // rotate start angle for next whorl
          prevRotationAngle[0] += this.param.rotate[dPlus1];
        }
      } else {
        // alternating or opposite branches
        // ensure even number of branches on segment if near opposite
        for (let branchInd = 0; branchInd < branchesOnSeg; branchInd++) {
          // calc offset in segment and on stem
          let offset: number;
          if (branchInd % 2 === 0) {
            offset = Math.min(Math.max(0, branchInd / branchesOnSeg), 1);
          } else {
            offset = Math.min(Math.max(0, (branchInd - branchDist) / branchesOnSeg), 1);
          }

          const stemOffset = ((segInd - 1 + offset) / curveRes) * stem.length;

          // if not in base area then set up the branch
          if (stemOffset > baseLength) {
            branchesArray.push(
              this.setUpBranch(
                turtle,
                stem,
                BranchMode.AltOpp,
                offset,
                startPoint,
                endPoint,
                stemOffset,
                branchInd,
                prevRotationAngle,
              ),
            );
          }
        }
      }
    }

    // make all new branches from branchesArray, passing posCorrTurtle which will be used to
    // set the position of branchTurtle in this call
    if (isLeaves) {
      for (const [posTur, dirTur] of branchesArray) {
        this.leavesArray.push(new Leaf(posTur.pos, dirTur.dir, dirTur.right));
      }
    } else {
      for (const [posTur, dirTur, rad, bOffset] of branchesArray) {
        this.makeStem(dirTur, new Stem(dPlus1, stem, bOffset, rad), 0, 0, 1, 1, posTur);
      }
    }
  }

  /**
   * add in new points in appropriate positions along curve and modify radius for flare
   */
  private increaseBezierPointRes(stem: Stem, segInd: number, pointsPerSeg: number): void {
    // need a copy of the end point as it is moved during the process, but also used for
    // calculations throughout
    const curveRes = Math.trunc(this.param.curveRes[stem.depth]);
    const segEndPoint = stem.bezierPoints[-1];
    const endPoint = new BezierPoint(
      segEndPoint.controlPoint.clone(),
      segEndPoint.handleLeft.clone(),
      segEndPoint.handleRight.clone(),
    );
    const segStartPoint = stem.bezierPoints[-2];
    const startPoint = new BezierPoint(
      segStartPoint.controlPoint.clone(),
      segStartPoint.handleLeft.clone(),
      segStartPoint.handleRight.clone(),
    );

    for (let k = 0; k < pointsPerSeg; k++) {
      // add new point and position
      // at this point the normals are left over-sized in order to allow for evaluation of the
      // original curve in later steps
      // once the stem is entirely built we then go back and scale the handles
      const offset = k / (pointsPerSeg - 1);
      let currPoint: BezierPoint;

      if (k === 0) {
        currPoint = segStartPoint;
      } else {
        if (k === 1) {
          currPoint = segEndPoint;
        } else {
          stem.bezierPoints.push(new BezierPoint());
          currPoint = stem.bezierPoints[stem.bezierPoints.length - 1];
        }

        if (k === pointsPerSeg - 1) {
          currPoint.controlPoint = endPoint.controlPoint;
          currPoint.handleLeft = endPoint.handleLeft;
          currPoint.handleRight = endPoint.handleRight;
        } else {
          currPoint.controlPoint = calcPointOnBezier(offset, startPoint, endPoint);
          // set handle to match direction of curve
          const tangent = calcTangentToBezier(offset, startPoint, endPoint).normalize();
          // and set the magnitude to match other control points
          const dirVecMag = endPoint.handleLeft.subtract(endPoint.controlPoint).length();
          currPoint.handleLeft = currPoint.controlPoint.subtract(tangent.scale(dirVecMag));
          currPoint.handleRight = currPoint.controlPoint.add(tangent.scale(dirVecMag));
        }
      }

      currPoint.radius = radiusAtOffset(
        stem,
        (offset + segInd - 1) / curveRes,
        this.param.taper[stem.depth],
        this.param.flare,
      );
    }
  }

  /**
   * Calculate leaf count of this stem as defined in paper
   */
  private calcLeafCount(stem: Stem): number {
    if (this.param.leafBlosNum >= 0) {
      // scale number of leaves to match global scale and taper
      const leaves = (this.param.leafBlosNum * this.treeScale) / this.param.gScale;

      if (!stem.parent) {
        throw new Error(`Stem doesn't have any parent stem.`);
      }

      return leaves * (stem.length / (stem.parent.lengthChildMax * stem.parent.length));
    } else {
      // fan leaves
      return this.param.leafBlosNum;
    }
  }

  /**
   * Calculate branch count of this stem as defined in paper
   */
  private calcBranchCount(stem: Stem): number {
    const dP1 = Math.min(stem.depth + 1, 3);

    let result: number;
    if (stem.depth === 0) {
      result = this.param.branches[dP1] * (random() * 0.2 + 0.9);
    } else if (this.param.branches[dP1] < 0) {
      result = this.param.branches[dP1];
    } else if (stem.depth === 1) {
      if (!stem.parent) {
        throw new Error(`Stem doesn't have any parent stem.`);
      }

      result =
        this.param.branches[dP1] *
        (0.2 + (0.8 * (stem.length / stem.parent.length)) / stem.parent.lengthChildMax);
    } else {
      if (!stem.parent) {
        throw new Error(`Stem doesn't have any parent stem.`);
      }

      result = this.param.branches[dP1] * (1.0 - (0.5 * stem.offset) / stem.parent.length);
    }

    return result / (1 - this.param.baseSize[stem.depth]);
  }

  /**
   * make clones of branch used if segSplits or baseSplits > 0
   */
  private makeClones(
    turtle: Turtle,
    segInd: number,
    splitCorrAngle: number,
    numBranchesFactor: number,
    cloneProb: number,
    stem: Stem,
    numOfSplits: number,
    splAngle: number,
    sprAngle: number,
    isBaseSplit: boolean,
  ) {
    const usingDirectSplit = this.param.splitAngle[stem.depth] < 0;
    const stemDepth = this.param.splitAngleV[stem.depth];

    if (!isBaseSplit && numOfSplits > 2 && usingDirectSplit) {
      throw new Error('Only splitting up to 3 branches is supported');
    }

    for (let splitIndex = 0; splitIndex < numOfSplits; splitIndex++) {
      // copy turtle for new branch
      const nTurtle = new Turtle(turtle);
      // tip branch down away from axis of stem
      nTurtle.pitchDown(splAngle / 2);

      // spread out clones
      let effSprAngle: number;
      if (isBaseSplit && !usingDirectSplit) {
        effSprAngle =
          (splitIndex + 1) * (360 / (numOfSplits + 1)) + randomInRange(-1, 1) * stemDepth;
      } else {
        effSprAngle = splitIndex === 0 ? sprAngle / 2 : -sprAngle / 2;
      }

      if (usingDirectSplit) {
        nTurtle.turnLeft(effSprAngle);
      } else {
        const quat = Quaternion.RotationAxis(new Vector3(0, 0, 1), Tools.ToRadians(effSprAngle));

        nTurtle.dir.rotateByQuaternionToRef(quat, nTurtle.dir);
        turtle.dir.normalize();
        nTurtle.right.rotateByQuaternionToRef(quat, nTurtle.right);
        turtle.right.normalize();
      }

      // create new clone branch and set up then recurse
      // split_stem = self.branches_curve.splines.new('BEZIER')
      // split_stem.resolution_u = stem.curve.resolution_u
      // split_stem.radius_interpolation = 'CARDINAL'
      const newStem = stem.copy();
      // newStem.curve = splitStem

      let cloned: Turtle | undefined;
      if (this.param.splitAngleV[stem.depth] >= 0) {
        cloned = turtle;
      } else {
        cloned = undefined;
      }

      this.makeStem(nTurtle, newStem, segInd, splitCorrAngle, numBranchesFactor, cloneProb, cloned);
    }
  }

  /**
   * Set up a new branch, creating the new direction and position turtle and orienting them
   * correctly and adding the required info to the list of branches to be made
   */
  // @@@ Maybe here worked last
  private setUpBranch(
    turtle: Turtle,
    stem: Stem,
    branchMode: BranchMode,
    offset: number,
    startPoint: BezierPoint,
    endPoint: BezierPoint,
    stemOffset: number,
    branchInd: number,
    prevRotAng: number[],
    branchesInGroup: number = 0,
  ): [Turtle, Turtle, number, number] {
    return [];
  }
}

/**
 * Enum to refer to branching modes
 */
enum BranchMode {
  AltOpp = 1,
  Whorled = 2,
  Fan = 3,
}
