import { InjectionToken } from '@angular/core';
import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../environments/environment';

import * as fromToolsPanel from './tools-panel/tools-panel.reducer';

export interface State {
  [fromToolsPanel.toolsPanelFeatureKey]: fromToolsPanel.State;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 *
 * @source: https://github.com/ngrx/platform/blob/master/projects/example-app/src/app/reducers/index.ts
 */
export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      [fromToolsPanel.toolsPanelFeatureKey]: fromToolsPanel.reducer,
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
