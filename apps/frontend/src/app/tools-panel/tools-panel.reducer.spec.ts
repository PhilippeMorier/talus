import { Tool } from './tool.model';
import { selectTool } from './tools-panel.actions';
import { reducer } from './tools-panel.reducer';

describe('ToolsPanelReducer', () => {
  it('should set selected tool', () => {
    const newState = reducer(undefined, selectTool({ id: Tool.SetVoxel }));

    expect(newState.selectedToolId).toEqual(Tool.SetVoxel);
  });
});
