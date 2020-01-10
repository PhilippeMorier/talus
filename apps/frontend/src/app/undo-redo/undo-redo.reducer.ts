import { Action, createReducer, on } from '@ngrx/store';
import { addUndo, undone } from './undo-redo.actions';

/**
 * Use normal reducer instead of meta-reducer, to have the state in the normal store
 * and therefore accessible (e.g. for display in app the number of redo actions).
 * Also use normal effects to run/replay/dispatch the action to be undone.
 */

export const featureKey = 'undoRedo';

export interface State {
  undoActions: Action[];
}

export const initialState: State = {
  undoActions: [],
};

export const reducer = createReducer(
  initialState,
  on(addUndo, (state, { undoAction }) => {
    return {
      ...state,
      undoActions: [undoAction, ...state.undoActions.slice(0, 10)],
    };
  }),
  on(undone, state => {
    return {
      ...state,
      undoActions: state.undoActions.slice(1),
    };
  }),
);

export const selectNewestUndoAction = (state: State) => state.undoActions[0];
