import { createReducer, on } from '@ngrx/store';
import { voxelAdded } from './scene-viewer-container.actions';

export const featureKey = 'sceneViewerContainer';

export interface State {
  voxelCount: number;
}

export const initialState: State = {
  voxelCount: 0,
};

export const reducer = createReducer(
  initialState,
  on(voxelAdded, state => {
    return {
      ...state,
      voxelCount: state.voxelCount + 1,
    };
  }),
);

export const selectVoxelCount = (state: State) => state.voxelCount;
