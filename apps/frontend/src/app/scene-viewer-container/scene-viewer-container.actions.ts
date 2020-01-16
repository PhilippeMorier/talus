import { createAction, props } from '@ngrx/store';
import { Coord } from '@talus/vdb';
import { VoxelChange } from './grid.service';

const actionTypePrefix = `[sceneViewerContainer]`;

export const addVoxel = createAction(
  `${actionTypePrefix} Add voxel`,
  props<{ position: Coord; value: number }>(),
);
export const addVoxelFailed = createAction(`${actionTypePrefix} Add voxel failed`);
export const voxelAdded = createAction(`${actionTypePrefix} Voxel added`, props<VoxelChange>());

export const addVoxels = createAction(
  `${actionTypePrefix} Add voxels`,
  props<{ positions: Coord[]; values: number[] }>(),
);
export const addVoxelsFailed = createAction(`${actionTypePrefix} Add voxels failed`);
export const voxelsAdded = createAction(
  `${actionTypePrefix} Voxels added`,
  props<{ voxelChanges: VoxelChange[] }>(),
);

export const removeVoxel = createAction(
  `${actionTypePrefix} Remove voxel`,
  props<{ position: Coord }>(),
);
export const removeVoxelFailed = createAction(`${actionTypePrefix} Remove voxel failed`);
export const voxelRemoved = createAction(`${actionTypePrefix} Voxel removed`, props<VoxelChange>());
