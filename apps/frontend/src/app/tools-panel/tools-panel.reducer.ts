import { createReducer, on } from '@ngrx/store';
import { Tool } from './tool.model';
import { selectTool } from './tools-panel.actions';

export const toolsPanelFeatureKey = 'toolsPanel';

export interface State {
  selectedToolId: Tool;
}

export const initialState: State = {
  selectedToolId: Tool.AddVoxel,
};

/** Provide reducer in AoT-compilation happy way */
export const reducer = createReducer(
  initialState,
  on(selectTool, (state, { id }) => {
    return {
      ...state,
      selectedToolId: id,
    };
  }),
);

export const getSelectedToolId = (state: State) => state.selectedToolId;
