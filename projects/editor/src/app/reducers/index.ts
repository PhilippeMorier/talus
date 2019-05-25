import {
  // ActionReducer,
  ActionReducerMap,
  // createFeatureSelector,
  // createSelector,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromViewport from '../editor-shell/viewport/viewport.reducer';

export interface State {
  viewport: fromViewport.State;
}

export const reducers: ActionReducerMap<State> = {
  viewport: fromViewport.reducer,
};

export const metaReducers: Array<MetaReducer<State>> = !environment.production ? [] : [];
