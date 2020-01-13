import { createAction } from '@ngrx/store';

const actionTypePrefix = '[app]';

export const wentOnline = createAction(`${actionTypePrefix} Went online`);
export const wentOffline = createAction(`${actionTypePrefix} Went offline`);
