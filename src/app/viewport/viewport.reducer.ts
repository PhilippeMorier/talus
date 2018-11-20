import * as ViewPort from './viewport.actions';

export interface State {
  voxelAdded: number;
}

export const initialState: State = {
  voxelAdded: 0,
};

export function reducer(state: State = initialState, action: ViewPort.ActionsUnion): State {
  switch (action.type) {
    case ViewPort.ActionTypes.AddVoxel: {
      return {
        ...state,
        voxelAdded: state.voxelAdded + 1,
      };
    }

    default: {
      return state;
    }
  }
}
