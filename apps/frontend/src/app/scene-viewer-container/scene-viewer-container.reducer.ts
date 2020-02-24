import { createReducer, on } from '@ngrx/store';
import { Coord } from '@talus/vdb';
import { updateSessions } from '../app.actions';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import { selectSession } from '../menu-bar-container/menu-bar-container.actions';
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
  session?: string;
  sessions: string[];
  voxelCount: number;
}

export const initialState: State = {
  isDarkTheme: true,
  selectedLineChanges: [],
  sessions: [],
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
  on(
    addFirstLineChange,
    (state, { affectedNodeOrigin, newValue, oldValue, xyz }): State => {
      return {
        ...state,
        selectedLineChanges: [{ affectedNodeOrigin, newValue, oldValue, xyz }],
      };
    },
  ),
  on(
    setLineChanges,
    (state, { voxelChanges }): State => {
      return {
        ...state,
        selectedLineChanges: [...voxelChanges],
      };
    },
  ),

  on(
    menuBarContainerActions.setDarkTheme,
    (state): State => {
      return { ...state, isDarkTheme: true };
    },
  ),
  on(
    menuBarContainerActions.setLightTheme,
    (state): State => {
      return { ...state, isDarkTheme: false };
    },
  ),

  on(
    updateSessions,
    (state, { sessions }): State => {
      return { ...state, sessions: sessions };
    },
  ),

  on(
    selectSession,
    (state, { session }): State => {
      return { ...state, session };
    },
  ),
);

export const selectVoxelCount = (state: State) => state.voxelCount;
