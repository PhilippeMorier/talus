import { createReducer, on } from '@ngrx/store';
import { Coord } from '@talus/vdb';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import { selectLinePoint, voxelRemoved, voxelSet } from './scene-viewer-container.actions';

export const featureKey = 'sceneViewerContainer';

export interface State {
  isDarkTheme: boolean;
  selectedPoints: Coord[];
  selectingPoints: boolean;
  voxelCount: number;
}

export const initialState: State = {
  isDarkTheme: true,
  selectedPoints: [],
  selectingPoints: false,
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

  on(selectLinePoint, (state, { xyz }) => {
    return {
      ...state,
      selectedPoints: state.selectingPoints ? [state.selectedPoints[0], xyz] : [xyz],
      selectingPoints: !state.selectingPoints,
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
