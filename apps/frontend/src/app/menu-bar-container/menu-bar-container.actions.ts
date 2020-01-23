import { createAction } from '@ngrx/store';

const actionTypePrefix = `[menuBarContainer]`;

export const undo = createAction(`${actionTypePrefix} Undo`);
export const redo = createAction(`${actionTypePrefix} Redo`);

export const setDarkTheme = createAction(`${actionTypePrefix} Set dark theme`);
export const setLightTheme = createAction(`${actionTypePrefix} Set light theme`);
