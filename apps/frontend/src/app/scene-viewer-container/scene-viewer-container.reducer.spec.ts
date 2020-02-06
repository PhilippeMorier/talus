import { VoxelChange } from './grid.service';
import { startLine, voxelRemoved, voxelSet } from './scene-viewer-container.actions';
import { reducer, selectVoxelCount } from './scene-viewer-container.reducer';

describe('SceneViewerContainerReducer', () => {
  const voxelChange: VoxelChange = {
    xyz: [0, 0, 0],
    affectedNodeOrigin: [0, 0, 0],
    oldValue: 24,
    newValue: 42,
  };

  it('should increment counter', () => {
    const stateWithOneVoxel = reducer(undefined, voxelSet(voxelChange));

    expect(stateWithOneVoxel.voxelCount).toEqual(1);
  });

  it('should decrement counter', () => {
    const stateWithOneVoxel = reducer(undefined, voxelSet(voxelChange));
    const stateWithNoVoxel = reducer(stateWithOneVoxel, voxelRemoved(voxelChange));

    expect(stateWithNoVoxel.voxelCount).toEqual(0);
  });

  it('should select voxel count', () => {
    const stateWithOneVoxel = reducer(undefined, voxelSet(voxelChange));

    expect(selectVoxelCount(stateWithOneVoxel)).toEqual(1);
  });

  it('should set first line coord', () => {
    const stateWithOneLineCoord = reducer(undefined, startLine({ xyz: [0, 0, 0], newValue: 42 }));

    expect(stateWithOneLineCoord.selectedLineStartCoord).toEqual([[0, 0, 0]]);
  });
});
