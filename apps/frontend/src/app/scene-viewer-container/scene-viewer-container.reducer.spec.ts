import { setDarkTheme, setLightTheme } from '../menu-bar-container/menu-bar-container.actions';
import { VoxelChange } from './grid.service';
import {
  addFirstLineChange,
  finishLine,
  setLineChanges,
  startLine,
} from './scene-viewer-container.actions';
import { reducer } from './scene-viewer-container.reducer';

describe('SceneViewerContainerReducer', () => {
  const voxelChange: VoxelChange = {
    xyz: [0, 0, 0],
    affectedNodeOrigin: [0, 0, 0],
    oldValue: 24,
    newValue: 42,
  };

  it('should set first line coord', () => {
    const stateWithOneLineCoord = reducer(undefined, startLine({ xyz: [0, 0, 0], newValue: 42 }));

    expect(stateWithOneLineCoord.selectedLineStartCoord).toEqual([0, 0, 0]);
  });

  it('should reset selected line changes and start coord', () => {
    const stateWithNoStartCoord = reducer(
      {
        isConnectedToKafkaProxy: true,
        isDarkTheme: true,
        selectedLineChanges: [voxelChange, voxelChange, voxelChange],
        selectedLineStartCoord: [0, 0, 0],
        topics: [],
      },
      finishLine({ voxelChanges: [] }),
    );

    expect(stateWithNoStartCoord.selectedLineChanges.length).toEqual(0);
    expect(stateWithNoStartCoord.selectedLineStartCoord).not.toBeDefined();
  });

  it('should add first line change', () => {
    const stateWithOneLineChange = reducer(undefined, addFirstLineChange(voxelChange));

    expect(stateWithOneLineChange.selectedLineChanges.length).toEqual(1);
    expect(stateWithOneLineChange.selectedLineChanges[0]).toEqual(voxelChange);
  });

  it('should set line changes', () => {
    const voxelChanges = [voxelChange, voxelChange];
    const stateWithLineChanges = reducer(undefined, setLineChanges({ voxelChanges }));

    expect(stateWithLineChanges.selectedLineChanges.length).toEqual(2);
    expect(stateWithLineChanges.selectedLineChanges).toEqual(voxelChanges);
  });

  it('should set dark theme', () => {
    const stateWithOneLineCoord = reducer(undefined, setDarkTheme());

    expect(stateWithOneLineCoord.isDarkTheme).toBeTruthy();
  });

  it('should set dark theme', () => {
    let stateWithTheme = reducer(undefined, setDarkTheme());
    stateWithTheme = reducer(stateWithTheme, setLightTheme());

    expect(stateWithTheme.isDarkTheme).toBeFalsy();
  });
});
