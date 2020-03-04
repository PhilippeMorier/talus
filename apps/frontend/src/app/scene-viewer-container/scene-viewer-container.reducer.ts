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
} from './scene-viewer-container.actions';

export const featureKey = 'sceneViewerContainer';

export interface State {
  isDarkTheme: boolean;
  selectedLineChanges: VoxelChange[];
  selectedLineStartCoord?: Coord;
  topic?: string;
  topics: Topic[];
}

export const initialState: State = {
  isDarkTheme: true,
  selectedLineChanges: [],
  topics: [],
};

export const reducer = createReducer<State>(
  initialState,

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
