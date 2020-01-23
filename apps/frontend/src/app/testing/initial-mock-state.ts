import * as fromApp from '../app.reducer';
import * as fromOptionsPanel from '../options-panel/options-panel.reducer';
import * as fromSceneViewerContainer from '../scene-viewer-container/scene-viewer-container.reducer';
import * as fromToolsPanel from '../tools-panel/tools-panel.reducer';
import * as fromUndoRedo from '../undo-redo/undo-redo.reducer';

export const initialMockState: fromApp.State = {
  [fromUndoRedo.featureKey]: fromUndoRedo.initialState,
  [fromOptionsPanel.featureKey]: fromOptionsPanel.initialState,
  [fromToolsPanel.featureKey]: fromToolsPanel.initialState,
  [fromSceneViewerContainer.featureKey]: fromSceneViewerContainer.initialState,
};
