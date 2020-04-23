import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export interface TreeParam {
  shape: number;
  gScale: number;
  gScaleV: number;
  levels: number;
  ratio: number;
  ratioPower: number;
  flare: number;
  baseSplits: number;
  baseSize: [number, number, number, number];
  downAngle: [number, number, number, number];
  downAngleV: [number, number, number, number];
  rotate: [number, number, number, number];
  rotateV: [number, number, number, number];
  branches: [number, number, number, number];
  length: [number, number, number, number];
  lengthV: [number, number, number, number];
  taper: [number, number, number, number];
  segSplits: [number, number, number, number];
  splitAngle: [number, number, number, number];
  splitAngleV: [number, number, number, number];
  curveRes: [number, number, number, number];
  curve: [number, number, number, number];
  curveBack: [number, number, number, number];
  curveV: [number, number, number, number];
  bendV: [number, number, number, number];
  branchDist: [number, number, number, number];
  radiusMod: [number, number, number, number];
  leafBlosNum: number;
  leafShape: number;
  leafScale: number;
  leafScaleX: number;
  leafBend: number;
  blossomShape: number;
  blossomScale: number;
  blossomRate: number;
  tropism: Vector3;
  pruneRatio: number;
  pruneWidth: number;
  pruneWidthPeak: number;
  prunePowerLow: number;
  prunePowerHigh: number;
}

export const DEFAULT_TREE_PARAM: TreeParam = {
  shape: 7,
  gScale: 13,
  gScaleV: 3,
  levels: 3,
  ratio: 0.015,
  ratioPower: 1.2,
  flare: 0.6,
  baseSplits: 0,
  baseSize: [0.3, 0.02, 0.02, 0.02],
  downAngle: [-0, 60, 45, 45],
  downAngleV: [-0, -50, 10, 10],
  rotate: [-0, 140, 140, 77],
  rotateV: [-0, 0, 0, 0],
  branches: [1, 50, 30, 10],
  length: [1, 0.3, 0.6, 0],
  lengthV: [0, 0, 0, 0],
  taper: [1, 1, 1, 1],
  segSplits: [0, 0, 0, 0],
  splitAngle: [40, 0, 0, 0],
  splitAngleV: [5, 0, 0, 0],
  curveRes: [5, 5, 3, 1],
  curve: [0, -40, -40, 0],
  curveBack: [0, 0, 0, 0],
  curveV: [20, 50, 75, 0],
  bendV: [-0, 50, 0, 0],
  branchDist: [-0, 0, 0, 0],
  radiusMod: [1, 1, 1, 1],
  leafBlosNum: 40,
  leafShape: 0,
  leafScale: 0.17,
  leafScaleX: 1,
  leafBend: 0.6,
  blossomShape: 1,
  blossomScale: 0,
  blossomRate: 0,
  tropism: new Vector3(0, 0, 0.5),
  pruneRatio: 0,
  pruneWidth: 0.5,
  pruneWidthPeak: 0.5,
  prunePowerLow: 0.5,
  prunePowerHigh: 0.5,
};
