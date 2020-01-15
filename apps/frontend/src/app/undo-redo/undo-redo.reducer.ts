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
  isRedoing: boolean;
  isUndoing: boolean;
  redoEndActionTypes: string[];
  redoStartActions: Action[];
  undoEndActionTypes: string[];
  undoStartActions: Action[];
}

export const initialState: State = {
  currentIndex: -1,
  isRedoing: false,
  isUndoing: false,
  redoEndActionTypes: [],
  redoStartActions: [],
  undoEndActionTypes: [],
  undoStartActions: [],
};

const maxBufferSize = 10;
const maxBufferIndex = maxBufferSize - 1;

export const reducer = createReducer(
  initialState,

  on(
    addUndo,
    (state, { redoStartAction, redoEndActionType, undoStartAction, undoEndActionType }) => {
      const newIndex = state.currentIndex + 1;

      const redoStartActions = state.redoStartActions.slice(0, newIndex);
      const redoEndActionTypes = state.redoEndActionTypes.slice(0, newIndex);
      const undoStartActions = state.undoStartActions.slice(0, newIndex);
      const undoEndActionTypes = state.undoEndActionTypes.slice(0, newIndex);

      return {
        ...state,
        currentIndex: newIndex > maxBufferIndex ? maxBufferIndex : newIndex,
        redoStartActions: [...redoStartActions.slice(-maxBufferIndex), redoStartAction],
        redoEndActionTypes: [...redoEndActionTypes.slice(-maxBufferIndex), redoEndActionType],
        undoStartActions: [...undoStartActions.slice(-maxBufferIndex), undoStartAction],
        undoEndActionTypes: [...undoEndActionTypes.slice(-maxBufferIndex), undoEndActionType],
      };
    },
  ),

  on(undo, menuBarContainerActions.undo, state => {
    return {
      ...state,
      isUndoing: true,
    };
  }),

  on(redo, menuBarContainerActions.redo, state => {
    return {
      ...state,
      isRedoing: true,
    };
  }),

  on(undone, state => {
    const newIndex = state.currentIndex - 1;

    return {
      ...state,
      isUndoing: false,
      currentIndex: newIndex < 0 ? -1 : newIndex,
    };
  }),

  on(redone, state => {
    const newIndex = state.currentIndex + 1;
    const maxRedoIndex = state.redoStartActions.length - 1;

    return {
      ...state,
      isRedoing: false,
      currentIndex: newIndex > maxRedoIndex ? maxRedoIndex : newIndex,
    };
  }),
);

export const selectCurrentRedoStartAction = (state: State) =>
  state.redoStartActions[state.currentIndex + 1];
export const selectCurrentRedoEndAction = (state: State) =>
  state.redoEndActionTypes[state.currentIndex + 1];
export const selectCurrentUndoStartAction = (state: State) =>
  state.undoStartActions[state.currentIndex];
export const selectCurrentUndoEndAction = (state: State) =>
  state.undoEndActionTypes[state.currentIndex];
