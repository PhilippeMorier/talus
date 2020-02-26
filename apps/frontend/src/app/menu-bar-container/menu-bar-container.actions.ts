import { createAction, props } from '@ngrx/store';

const actionTypePrefix = `[menuBarContainer]`;

export const undo = createAction(`${actionTypePrefix} Undo`);
export const redo = createAction(`${actionTypePrefix} Redo`);

export const setDarkTheme = createAction(`${actionTypePrefix} Set dark theme`);
export const setLightTheme = createAction(`${actionTypePrefix} Set light theme`);

export const openTopicDialog = createAction(
  `${actionTypePrefix} Open topic dialog`,
  props<{ topics: string[] }>(),
);
export const openTopicDialogFailed = createAction(`${actionTypePrefix} Open topic dialog failed`);
export const selectTopic = createAction(
  `${actionTypePrefix} Select topic`,
  props<{ topic: string }>(),
);
