import { Action, createAction, props } from '@ngrx/store';

const actionTypePrefix = `[undoRedo]`;

export const addUndo = createAction(
  `${actionTypePrefix} Add undo`,
  props<{
    redoStartAction: Action;
    redoEndActionType: string;
    undoStartAction: Action;
    undoEndActionType: string;
  }>(),
);

export const undo = createAction(`${actionTypePrefix} Undo`);

export const undone = createAction(`${actionTypePrefix} Undone`);

export const addRedo = createAction(
  `${actionTypePrefix} Add redo`,
  props<{ redoAction: Action }>(),
);

export const redo = createAction(`${actionTypePrefix} Redo`);

export const redone = createAction(`${actionTypePrefix} Redone`);
