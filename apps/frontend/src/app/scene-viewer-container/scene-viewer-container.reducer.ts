import { createReducer, on } from '@ngrx/store';
import { Topic } from '@talus/model';
import { Coord } from '@talus/vdb';
import { updateTopics } from '../app.actions';
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
  topic?: string;
  topics: Topic[];
  voxelCount: number;
}

export const initialState: State = {
  isDarkTheme: true,
  selectedLineChanges: [],
  topics: [],
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
    updateTopics,
    (state, { topics }): State => {
      return { ...state, topics };
    },
  ),

  on(
    menuBarContainerActions.selectTopic,
    (state, { topic }): State => {
      return {
        ...state,
        selectedLineChanges: initialState.selectedLineChanges,
        selectedLineStartCoord: initialState.selectedLineStartCoord,
        topic,
      };
    },
  ),
);

export const selectVoxelCount = (state: State) => state.voxelCount;
