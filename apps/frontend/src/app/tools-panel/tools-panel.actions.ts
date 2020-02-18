import { createAction, props } from '@ngrx/store';
import { Tool } from '@talus/model';

export const selectTool = createAction('[toolsPanel] Select tool', props<{ id: Tool }>());
