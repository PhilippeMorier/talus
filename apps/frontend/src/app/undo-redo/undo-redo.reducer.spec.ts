import { VoxelChange } from '../scene-viewer-container/grid.service';
import { addVoxel, removeVoxel, voxelAdded, voxelRemoved } from '../scene-viewer-container/scene-viewer-container.actions';
import { addUndo, redo, undo, undone } from './undo-redo.actions';
import {
  reducer,
  selectCurrentRedoEndAction,
  selectCurrentRedoStartAction,
  selectCurrentUndoEndAction,
  selectCurrentUndoStartAction,
} from './undo-redo.reducer';

describe('UndoRedoReducer', () => {
  const voxelChange: VoxelChange = {
    position: [0, 0, 0],
    affectedNodeOrigin: [0, 0, 0],
    value: 42,
  };
  const lastVoxelChange: VoxelChange = {
    position: [1, 1, 1],
    affectedNodeOrigin: [1, 1, 1],
    value: 24,
  };
  const undoStep = {
    redoStartAction: addVoxel(voxelChange),
    redoEndActionType: voxelAdded.type,
    undoStartAction: removeVoxel({ position: voxelChange.position }),
    undoEndActionType: voxelRemoved.type,
  };
  const lastUndoStep = {
    redoStartAction: addVoxel(lastVoxelChange),
    redoEndActionType: voxelAdded.type,
    undoStartAction: removeVoxel({ position: lastVoxelChange.position }),
    undoEndActionType: voxelRemoved.type,
  };

  it('should be undoing', () => {
    const newState = reducer(undefined, undo());

    expect(newState.isUndoing).toEqual(true);
  });

  it('should be redoing', () => {
    const newState = reducer(undefined, redo());

    expect(newState.isRedoing).toEqual(true);
  });

  it('should add undo step', () => {
    let newState = reducer(undefined, addUndo(undoStep));
    newState = reducer(newState, addUndo(undoStep));
    newState = reducer(newState, addUndo(undoStep));

    expect(newState.redoStartActions.length).toEqual(3);
    expect(newState.redoEndActionTypes.length).toEqual(3);
    expect(newState.undoStartActions.length).toEqual(3);
    expect(newState.undoEndActionTypes.length).toEqual(3);
  });

  it('should update current index', () => {
    let newState = reducer(undefined, addUndo(undoStep));
    newState = reducer(newState, addUndo(undoStep));
    newState = reducer(newState, addUndo(lastUndoStep));

    expect(newState.currentIndex).toEqual(2);
    expect(newState.redoEndActionTypes.length).toEqual(3);
    expect(newState.undoStartActions.length).toEqual(3);
    expect(newState.undoEndActionTypes.length).toEqual(3);

    expect(selectCurrentUndoStartAction(newState)).toEqual(lastUndoStep.undoStartAction);
    expect(selectCurrentUndoEndAction(newState)).toEqual(lastUndoStep.undoEndActionType);
    expect(selectCurrentRedoStartAction(newState)).toBeUndefined();
    expect(selectCurrentRedoEndAction(newState)).toBeUndefined();
  });

  it('should select current undo/redo', () => {
    let newState = reducer(undefined, addUndo(undoStep));
    newState = reducer(newState, addUndo(undoStep));
    newState = reducer(newState, addUndo(lastUndoStep));

    expect(selectCurrentUndoStartAction(newState)).toEqual(lastUndoStep.undoStartAction);
    expect(selectCurrentUndoEndAction(newState)).toEqual(lastUndoStep.undoEndActionType);
    expect(selectCurrentRedoStartAction(newState)).toBeUndefined();
    expect(selectCurrentRedoEndAction(newState)).toBeUndefined();
  });

  it('should select current undo/redo after one undone', () => {
    let newState = reducer(undefined, addUndo(undoStep));
    newState = reducer(newState, addUndo(undoStep));
    newState = reducer(newState, addUndo(lastUndoStep));
    newState = reducer(newState, undone());

    expect(newState.currentIndex).toEqual(1);

    expect(newState.redoStartActions.length).toEqual(3);
    expect(newState.redoEndActionTypes.length).toEqual(3);
    expect(newState.undoStartActions.length).toEqual(3);
    expect(newState.undoEndActionTypes.length).toEqual(3);

    expect(selectCurrentUndoStartAction(newState)).toEqual(undoStep.undoStartAction);
    expect(selectCurrentUndoEndAction(newState)).toEqual(undoStep.undoEndActionType);
    expect(selectCurrentRedoStartAction(newState)).toEqual(lastUndoStep.redoStartAction);
    expect(selectCurrentRedoEndAction(newState)).toEqual(lastUndoStep.redoEndActionType);
  });
});
