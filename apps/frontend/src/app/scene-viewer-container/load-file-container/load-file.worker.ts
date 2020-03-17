/// <reference lib="webworker" />

import { AssetContainer } from '@babylonjs/core';
import { NullEngine } from '@babylonjs/core/Engines/nullEngine';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer';
import { Scene } from '@babylonjs/core/scene';
import { FloatArray } from '@babylonjs/core/types';
// https://doc.babylonjs.com/how_to/obj
import '@babylonjs/loaders/OBJ/objFileLoader';
import { Coord } from '@talus/vdb';

export interface LoadFileStatus {
  coords: Coord[];
  isConverting: boolean;
  isLoading: boolean;
  progress: number;
}

addEventListener('message', ({ data: file }) => {
  loadFile(file);
});

function loadFile(file: File): void {
  // SceneLoader needs a scene. A scene object can't be passed/cloned to the worker.
  // Therefore, create a no-op scene.
  const nullScene = new Scene(new NullEngine());

  postStatusMessage({ coords: [], isConverting: false, isLoading: true, progress: 0 });
  SceneLoader.LoadAssetContainer('file:', file, nullScene, onSuccess);

  function onSuccess(assets: AssetContainer): void {
    postStatusMessage({ coords: [], isConverting: true, isLoading: false, progress: 0 });

    const positions = getPositions(assets);
    const coords = floatArrayToCoords(positions);

    postStatusMessage({ coords, isConverting: false, isLoading: false, progress: 100 });
  }
}

function postStatusMessage(status: LoadFileStatus): void {
  postMessage(status);
}

function getPositions(assets: AssetContainer): FloatArray {
  if (assets.meshes.length < 1) {
    return [];
  }

  const positions = assets.meshes[0].getVerticesData(VertexBuffer.PositionKind);
  if (!positions) {
    return [];
  }

  return positions;
}

function floatArrayToCoords(positions: FloatArray): Coord[] {
  const coords: Coord[] = [];

  const progressFactor = 100 / positions.length;
  let progress = 0;

  for (let i = 0; i < positions.length; i += 3) {
    coords.push([positions[i], positions[i + 1], positions[i + 2]]);

    const currentProgress = Math.trunc(i * progressFactor);
    if (progress !== currentProgress) {
      progress = currentProgress;
      postStatusMessage({ coords: [], isConverting: true, isLoading: false, progress });
    }
  }

  return coords;
}
