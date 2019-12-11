import { createAction, props } from '@ngrx/store';
import { Coord } from '@talus/vdb';

const actionTypePrefix = '[SceneViewerContainer]';

export const addVoxel = createAction(
  `${actionTypePrefix} Add voxel`,
  props<{ position: Coord; value: number }>(),
);

export const removeVoxel = createAction(
  `${actionTypePrefix} Remove voxel`,
  props<{ position: Coord }>(),
);
