import { InjectionToken } from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../environments/environment';
import * as fromOptionsPanel from './options-panel/options-panel.reducer';
import * as fromSceneViewerContainer from './scene-viewer-container/scene-viewer-container.reducer';
import * as fromToolsPanel from './tools-panel/tools-panel.reducer';
import * as fromUndoRedo from './undo-redo/undo-redo.reducer';

export interface State {
  [fromUndoRedo.featureKey]: fromUndoRedo.State;
  [fromOptionsPanel.featureKey]: fromOptionsPanel.State;
  [fromToolsPanel.featureKey]: fromToolsPanel.State;
  [fromSceneViewerContainer.featureKey]: fromSceneViewerContainer.State;
}

/**
 * The state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 *
 * @source: https://github.com/ngrx/platform/blob/master/projects/example-app/src/app/reducers/index.ts
 */
export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      [fromSceneViewerContainer.featureKey]: fromSceneViewerContainer.reducer,
      [fromOptionsPanel.featureKey]: fromOptionsPanel.reducer,
      [fromToolsPanel.featureKey]: fromToolsPanel.reducer,
      [fromUndoRedo.featureKey]: fromUndoRedo.reducer,
    }),
  },
);

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger] : [];

/**
 * SceneViewerContainer reducers
 */
export const selectSceneViewerContainerState = createFeatureSelector<
  State,
  fromSceneViewerContainer.State
>(fromSceneViewerContainer.featureKey);

export const selectVoxelCount = createSelector(
  selectSceneViewerContainerState,
  fromSceneViewerContainer.selectVoxelCount,
);

/**
 * ToolsPanel reducers
 */
export const selectToolsPanelState = createFeatureSelector<State, fromToolsPanel.State>(
  fromToolsPanel.featureKey,
);

export const selectSelectedToolId = createSelector(
  selectToolsPanelState,
  fromToolsPanel.selectSelectedToolId,
);

/**
 * UndoRedo reducers
 */
export const selectUndoRedoState = createFeatureSelector<State, fromUndoRedo.State>(
  fromUndoRedo.featureKey,
);

export const selectCurrentUndoStartAction = createSelector(
  selectUndoRedoState,
  fromUndoRedo.selectCurrentUndoStartAction,
);

export const selectCurrentRedoStartAction = createSelector(
  selectUndoRedoState,
  fromUndoRedo.selectCurrentRedoStartAction,
);

export const selectCurrentUndoEndAction = createSelector(
  selectUndoRedoState,
  fromUndoRedo.selectCurrentUndoEndAction,
);

export const selectCurrentRedoEndAction = createSelector(
  selectUndoRedoState,
  fromUndoRedo.selectCurrentRedoEndAction,
);

/**
 * OptionsPanel reducers
 */
export const selectOptionsPanelState = createFeatureSelector<State, fromOptionsPanel.State>(
  fromOptionsPanel.featureKey,
);

export const selectColors = createSelector(selectOptionsPanelState, fromOptionsPanel.selectColors);
export const selectCssColors = createSelector(
  selectOptionsPanelState,
  fromOptionsPanel.selectCssColors,
);

export const selectSelectedColor = createSelector(
  selectOptionsPanelState,
  fromOptionsPanel.selectSelectedColor,
);

export const selectSelectedCssColor = createSelector(
  selectOptionsPanelState,
  fromOptionsPanel.selectSelectedCssColor,
);

export const selectSelectedIntColor = createSelector(
  selectOptionsPanelState,
  fromOptionsPanel.selectSelectedIntColor,
);

export const selectSelectedColorIndex = createSelector(
  selectOptionsPanelState,
  fromOptionsPanel.selectSelectedColorIndex,
);
