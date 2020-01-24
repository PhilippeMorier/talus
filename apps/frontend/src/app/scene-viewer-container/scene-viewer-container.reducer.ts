import { createReducer, on } from '@ngrx/store';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import { voxelRemoved, voxelSet } from './scene-viewer-container.actions';

export const featureKey = 'sceneViewerContainer';

export interface State {
  isDarkTheme: boolean;
  voxelCount: number;
}

export const initialState: State = {
  isDarkTheme: true,
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

  on(menuBarContainerActions.setDarkTheme, state => {
    return { ...state, isDarkTheme: true };
  }),
  on(menuBarContainerActions.setLightTheme, state => {
    return { ...state, isDarkTheme: false };
  }),
);

export const selectVoxelCount = (state: State) => state.voxelCount;
