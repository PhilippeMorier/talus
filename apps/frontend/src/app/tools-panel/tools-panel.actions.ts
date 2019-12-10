import { createAction, props } from '@ngrx/store';
import { Tool } from './tool.model';

export const selectTool = createAction('[ToolsPanel] Select tool', props<{ id: Tool }>());
