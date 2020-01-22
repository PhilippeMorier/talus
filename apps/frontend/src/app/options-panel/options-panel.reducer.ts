import { createReducer, on } from '@ngrx/store';
import { Rgba } from '../model/rgba.value';
import { selectColor } from './options-panel.actions';

export const featureKey = 'optionsPanel';

export interface State {
  colors: Rgba[];
  selectedColorIndex: number;
}

export const initialState: State = {
  colors: [
    {
      r: 255,
      g: 255,
      b: 255,
      a: 255,
    },
    {
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    },
    {
      r: 0,
      g: 0,
      b: 255,
      a: 255,
    },
    {
      r: 0,
      g: 255,
      b: 0,
      a: 255,
    },
    {
      r: 0,
      g: 255,
      b: 255,
      a: 255,
    },
    {
      r: 255,
      g: 0,
      b: 0,
      a: 255,
    },
  ],
  selectedColorIndex: 4,
};

export const reducer = createReducer(
  initialState,
  on(selectColor, (state, { colorIndex }) => {
    return {
      ...state,
      selectedColorIndex: colorIndex,
    };
  }),
);

export const selectColors = (state: State) => state.colors;
export const selectSelectedColor = (state: State) => state.colors[state.selectedColorIndex];
export const selectSelectedColorIndex = (state: State) => state.selectedColorIndex;
