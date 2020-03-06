import { createAction, props } from '@ngrx/store';
import { Topic } from '@talus/model';

const actionTypePrefix = '[app]';

export const wentOnline = createAction(`${actionTypePrefix} Went online`);
export const wentOffline = createAction(`${actionTypePrefix} Went offline`);

export const updateTopics = createAction(
  `${actionTypePrefix} Update topics`,
  props<{ topics: Topic[] }>(),
);
export const updateConnectionStatus = createAction(
  `${actionTypePrefix} Update connection status`,
  props<{ isConnectedToKafkaProxy: boolean }>(),
);
export const updateLastLoadedMessageOffset = createAction(
  `${actionTypePrefix} Update last loaded message offset`,
  props<{ offset: number }>(),
);
