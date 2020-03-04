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

export const undone = createAction(`${actionTypePrefix} Undone`);

export const redone = createAction(`${actionTypePrefix} Redone`);
