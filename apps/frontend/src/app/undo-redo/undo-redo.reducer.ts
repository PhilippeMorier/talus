import { Action, createReducer, on } from '@ngrx/store';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import { addUndo, redo, redone, undo, undone } from './undo-redo.actions';

/**
 * Use normal reducer instead of meta-reducer, to have the state in the normal store
 * and therefore accessible (e.g. for display in app the number of redo actions).
 * Also use normal effects to run/replay/dispatch the action to be undone.
 */

export const featureKey = 'undoRedo';

export interface State {
  currentIndex: number;
  isUndoRedoing: boolean;
  redoActions: Action[];
  undoActions: Action[];
}

export const initialState: State = {
  currentIndex: -1,
  isUndoRedoing: false,
  redoActions: [],
  undoActions: [],
};

const maxBufferSize = 10;
const maxBufferIndex = maxBufferSize - 1;

export const reducer = createReducer(
  initialState,

  on(addUndo, (state, { redoAction, undoAction }) => {
    const newIndex = state.currentIndex + 1;

    const redoActions = state.redoActions.slice(0, newIndex);
    const undoActions = state.undoActions.slice(0, newIndex);

    return {
      ...state,
      currentIndex: newIndex > maxBufferIndex ? maxBufferIndex : newIndex,
      redoActions: [...redoActions.slice(-maxBufferIndex), redoAction],
      undoActions: [...undoActions.slice(-maxBufferIndex), undoAction],
    };
  }),

  on(undo, menuBarContainerActions.undo, redo, menuBarContainerActions.redo, state => {
    return {
      ...state,
      isUndoRedoing: true,
    };
  }),

  on(undone, state => {
    const newIndex = state.currentIndex - 1;

    return {
      ...state,
      isUndoRedoing: false,
      currentIndex: newIndex < 0 ? -1 : newIndex,
    };
  }),

  on(redone, state => {
    const newIndex = state.currentIndex + 1;
    const maxRedoIndex = state.redoActions.length - 1;

    return {
      ...state,
      isUndoRedoing: false,
      currentIndex: newIndex > maxRedoIndex ? maxRedoIndex : newIndex,
    };
  }),
);

export const selectCurrentUndoAction = (state: State) => state.undoActions[state.currentIndex];
export const selectCurrentRedoAction = (state: State) => state.redoActions[state.currentIndex + 1];
