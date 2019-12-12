import { createAction, props } from '@ngrx/store';
import { Coord } from '@talus/vdb';

const actionTypePrefix = '[SceneViewerContainer]';

export const addVoxel = createAction(
  `${actionTypePrefix} Add voxel`,
  props<{ position: Coord; value: number }>(),
);
export const addVoxelFailed = createAction(`${actionTypePrefix} Add voxel failed`);
export const voxelAdded = createAction(`${actionTypePrefix} Voxel added`);

export const removeVoxel = createAction(
  `${actionTypePrefix} Remove voxel`,
  props<{ position: Coord }>(),
);
export const removeVoxelFailed = createAction(`${actionTypePrefix} Remove voxel failed`);
export const voxelRemoved = createAction(`${actionTypePrefix} Voxel removed`);
