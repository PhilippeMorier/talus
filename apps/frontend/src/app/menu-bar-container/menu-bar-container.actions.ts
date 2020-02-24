import { createAction, props } from '@ngrx/store';

const actionTypePrefix = `[menuBarContainer]`;

export const undo = createAction(`${actionTypePrefix} Undo`);
export const redo = createAction(`${actionTypePrefix} Redo`);

export const setDarkTheme = createAction(`${actionTypePrefix} Set dark theme`);
export const setLightTheme = createAction(`${actionTypePrefix} Set light theme`);

export const openSessionDialog = createAction(
  `${actionTypePrefix} Open session dialog`,
  props<{ sessions: string[] }>(),
);
export const openSessionDialogFailed = createAction(
  `${actionTypePrefix} Open session dialog failed`,
);
export const selectSession = createAction(
  `${actionTypePrefix} Select session`,
  props<{ session: string }>(),
);
