import { createAction, props } from '@ngrx/store';
import { Coord } from '@talus/vdb';
import { VoxelChange } from './grid.service';

const actionTypePrefix = `[sceneViewerContainer]`;

// Set voxel
export const setVoxel = createAction(
  `${actionTypePrefix} Set voxel`,
  props<{ position: Coord; value: number }>(),
);
export const setVoxelFailed = createAction(`${actionTypePrefix} Set voxel failed`);
export const voxelSet = createAction(`${actionTypePrefix} Voxel set`, props<VoxelChange>());

// Set voxels
export const setVoxels = createAction(
  `${actionTypePrefix} Set voxels`,
  props<{ positions: Coord[]; values: number[] }>(),
);
export const setVoxelsFailed = createAction(`${actionTypePrefix} Set voxels failed`);
export const voxelsSet = createAction(
  `${actionTypePrefix} Voxels set`,
  props<{ voxelChanges: VoxelChange[] }>(),
);

// Remove voxel
export const removeVoxel = createAction(
  `${actionTypePrefix} Remove voxel`,
  props<{ position: Coord }>(),
);
export const removeVoxelFailed = createAction(`${actionTypePrefix} Remove voxel failed`);
export const voxelRemoved = createAction(`${actionTypePrefix} Voxel removed`, props<VoxelChange>());

// Paint voxel
export const paintVoxel = createAction(
  `${actionTypePrefix} Paint voxel`,
  props<{ position: Coord }>(),
);
export const paintVoxelFailed = createAction(`${actionTypePrefix} Paint voxel failed`);
export const voxelPainted = createAction(`${actionTypePrefix} Voxel painted`, props<VoxelChange>());
