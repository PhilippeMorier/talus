import { createReducer, on } from '@ngrx/store';
import { Topic } from '@talus/model';
import { Coord } from '@talus/vdb';
import {
  updateConnectionStatus,
  updateLastLoadedMessageOffset,
  updateTopics,
} from '../app.actions';
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
  isConnectedToKafkaProxy: boolean;
  isDarkTheme: boolean;
  lastLoadedMessageOffset: number;
  selectedLineChanges: VoxelChange[];
  selectedLineStartCoord?: Coord;
  topic?: string;
  topics: Topic[];
}

export const initialState: State = {
  isConnectedToKafkaProxy: false,
  isDarkTheme: true,
  lastLoadedMessageOffset: 0,
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
    updateLastLoadedMessageOffset,
    (state, { offset }): State => {
      return { ...state, lastLoadedMessageOffset: offset };
    },
  ),
  on(
    updateConnectionStatus,
    (state, { isConnectedToKafkaProxy }): State => {
      return { ...state, isConnectedToKafkaProxy };
    },
  ),

  on(
    menuBarContainerActions.selectTopic,
    (state, { topic }): State => {
      return {
        ...state,
        lastLoadedMessageOffset: 0,
        selectedLineChanges: initialState.selectedLineChanges,
        selectedLineStartCoord: initialState.selectedLineStartCoord,
        topic,
      };
    },
  ),
);

export const selectTopicLoadingProgressValue = (state: State) => state.lastLoadedMessageOffset;
