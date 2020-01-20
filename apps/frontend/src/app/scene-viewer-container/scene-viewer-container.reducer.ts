import { createReducer, on } from '@ngrx/store';
import { voxelSet, voxelRemoved } from './scene-viewer-container.actions';

export const featureKey = 'sceneViewerContainer';

export interface State {
  voxelCount: number;
}

export const initialState: State = {
  voxelCount: 0,
};

export const reducer = createReducer(
  initialState,
  on(voxelSet, state => {
    return {
      ...state,
      voxelCount: state.voxelCount + 1,
    };
  }),
  on(voxelRemoved, state => {
    return {
      ...state,
      voxelCount: state.voxelCount - 1,
    };
  }),
);

export const selectVoxelCount = (state: State) => state.voxelCount;
