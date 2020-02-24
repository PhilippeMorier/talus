import { createAction, props } from '@ngrx/store';

const actionTypePrefix = '[app]';

export const wentOnline = createAction(`${actionTypePrefix} Went online`);
export const wentOffline = createAction(`${actionTypePrefix} Went offline`);

export const updateSessions = createAction(
  `${actionTypePrefix} Update sessions`,
  props<{ sessions: string[] }>(),
);
