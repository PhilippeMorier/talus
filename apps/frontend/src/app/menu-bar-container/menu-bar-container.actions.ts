import { createAction } from '@ngrx/store';

const actionTypePrefix = `[menuBarContainer]`;

export const undo = createAction(`${actionTypePrefix} Undo`);
export const redo = createAction(`${actionTypePrefix} Redo`);
