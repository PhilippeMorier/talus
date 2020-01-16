import { Action } from '@ngrx/store';
import { Coord } from '@talus/vdb';
import { VoxelChange } from '../scene-viewer-container/grid.service';
import {
  addVoxel,
  removeVoxel,
  voxelAdded,
  voxelRemoved,
} from '../scene-viewer-container/scene-viewer-container.actions';
import { addUndo, redo, redone, undo, undone } from './undo-redo.actions';
import {
  reducer,
  selectCurrentRedoEndAction,
  selectCurrentRedoStartAction,
  selectCurrentUndoEndAction,
  selectCurrentUndoStartAction,
  State,
} from './undo-redo.reducer';

describe('UndoRedoReducer', () => {
  const voxelChange0 = createVoxelChange([0, 0, 0]);
  const step0 = createStep(voxelChange0);
  const voxelChange1 = createVoxelChange([1, 1, 1]);
  const step1 = createStep(voxelChange1);
  const voxelChange2 = createVoxelChange([2, 2, 2]);
  const step2 = createStep(voxelChange2);

  it('should be undoing', () => {
    const newState = reducer(undefined, undo());

    expect(newState.isUndoing).toEqual(true);
  });

  it('should be redoing', () => {
    const newState = reducer(undefined, redo());

    expect(newState.isRedoing).toEqual(true);
  });

  it('should add undo step', () => {
    let newState = reducer(undefined, addUndo(step0));
    newState = reducer(newState, addUndo(step1));
    newState = reducer(newState, addUndo(step2));

    expectActionLengthToEqual(newState, 3);
  });

  it('should update current index', () => {
    let newState = reducer(undefined, addUndo(step0));
    newState = reducer(newState, addUndo(step1));
    newState = reducer(newState, addUndo(step2));

    expect(newState.currentIndex).toEqual(2);
    expectActionLengthToEqual(newState, 3);
  });

  it('should select current undo/redo', () => {
    let newState = reducer(undefined, addUndo(step0));
    newState = reducer(newState, addUndo(step1));
    newState = reducer(newState, addUndo(step2));

    expect(selectCurrentUndoStartAction(newState)).toEqual(step2.undoStartAction);
    expect(selectCurrentUndoEndAction(newState)).toEqual(step2.undoEndActionType);
    expect(selectCurrentRedoStartAction(newState)).toBeUndefined();
    expect(selectCurrentRedoEndAction(newState)).toBeUndefined();
  });

  it('should select current undo/redo after one undone', () => {
    let newState = reducer(undefined, addUndo(step0));
    newState = reducer(newState, addUndo(step1));
    newState = reducer(newState, addUndo(step2));
    newState = reducer(newState, undone());

    expect(newState.currentIndex).toEqual(1);
    expectActionLengthToEqual(newState, 3);

    expect(selectCurrentUndoStartAction(newState)).toEqual(step1.undoStartAction);
    expect(selectCurrentUndoEndAction(newState)).toEqual(step1.undoEndActionType);
    expect(selectCurrentRedoStartAction(newState)).toEqual(step2.redoStartAction);
    expect(selectCurrentRedoEndAction(newState)).toEqual(step2.redoEndActionType);
  });

  it('should select current undo/redo after three undone & one redo', () => {
    let newState = reducer(undefined, addUndo(step0));
    newState = reducer(newState, addUndo(step1));
    newState = reducer(newState, addUndo(step2));
    newState = reducer(newState, undone());
    newState = reducer(newState, undone());
    newState = reducer(newState, undone());
    newState = reducer(newState, redone());

    expect(newState.currentIndex).toEqual(0);
    expectActionLengthToEqual(newState, 3);

    expect(selectCurrentUndoStartAction(newState)).toEqual(step0.undoStartAction);
    expect(selectCurrentUndoEndAction(newState)).toEqual(step0.undoEndActionType);
    expect(selectCurrentRedoStartAction(newState)).toEqual(step1.redoStartAction);
    expect(selectCurrentRedoEndAction(newState)).toEqual(step1.redoEndActionType);
  });
});

function createVoxelChange(xyz: Coord): VoxelChange {
  return {
    position: xyz,
    affectedNodeOrigin: xyz,
    value: 42,
  };
}

function createStep(
  voxelChange: VoxelChange,
): {
  redoEndActionType: string;
  redoStartAction: Action;
  undoEndActionType: string;
  undoStartAction: Action;
} {
  return {
    redoStartAction: addVoxel(voxelChange),
    redoEndActionType: voxelAdded.type,
    undoStartAction: removeVoxel({ position: voxelChange.position }),
    undoEndActionType: voxelRemoved.type,
  };
}

function expectActionLengthToEqual(state: State, length: number): void {
  expect(state.redoStartActions.length).toEqual(length);
  expect(state.redoEndActionTypes.length).toEqual(length);
  expect(state.undoStartActions.length).toEqual(length);
  expect(state.undoEndActionTypes.length).toEqual(length);
}
