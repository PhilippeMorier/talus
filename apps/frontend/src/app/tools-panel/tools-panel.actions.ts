import { createAction, props } from '@ngrx/store';
import { Tool } from './tool.model';

export const selectTool = createAction('[toolsPanel] Select tool', props<{ id: Tool }>());
