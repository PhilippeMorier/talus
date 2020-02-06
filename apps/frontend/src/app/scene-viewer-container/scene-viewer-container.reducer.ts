import { createReducer, on } from '@ngrx/store';
import { Coord } from '@talus/vdb';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import { VoxelChange } from './grid.service';
import {
  addFirstLineChange,
  finishLine,
  setLineChanges,
  startLine,
  voxelRemoved,
  voxelSet,
} from './scene-viewer-container.actions';

export const featureKey = 'sceneViewerContainer';

export interface State {
  isDarkTheme: boolean;
  selectedLineChanges: VoxelChange[];
  selectedLineStartCoord?: Coord;
  voxelCount: number;
}

export const initialState: State = {
  isDarkTheme: true,
  selectedLineChanges: [],
  voxelCount: 0,
};

export const reducer = createReducer<State>(
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

  on(
    startLine,
    (state, { xyz }): State => {
      return {
        ...state,
        selectedLineStartCoord: xyz,
      };
    },
  ),
  on(
    finishLine,
    (state): State => {
      return {
        ...state,
        selectedLineChanges: [],
        selectedLineStartCoord: undefined,
      };
    },
  ),
  on(addFirstLineChange, (state, voxelChange) => {
    return {
      ...state,
      selectedLineChanges: [voxelChange],
    };
  }),
  on(setLineChanges, (state, { voxelChanges }) => {
    return {
      ...state,
      selectedLineChanges: voxelChanges,
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
