import { createAction, props } from '@ngrx/store';
import { Tool } from '../model/tool.value';

export const selectTool = createAction('[toolsPanel] Select tool', props<{ id: Tool }>());
