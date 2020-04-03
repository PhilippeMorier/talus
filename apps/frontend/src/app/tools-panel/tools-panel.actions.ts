import { createAction, props } from '@ngrx/store';
import { Tool } from '@talus/model';

const actionTypePrefix = `[toolsPanel]`;

export const selectTool = createAction(`${actionTypePrefix} Select tool`, props<{ id: Tool }>());

export const removeSelectionLinePreview = createAction(
  `${actionTypePrefix} Remove selection line preview`,
);
