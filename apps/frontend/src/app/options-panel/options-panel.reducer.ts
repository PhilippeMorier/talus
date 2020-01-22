import { createReducer, on } from '@ngrx/store';
import { UiColorDialogColor } from '@talus/ui';
import { selectColor } from './options-panel.actions';

export const featureKey = 'optionsPanel';

export interface State {
  colors: UiColorDialogColor[];
  selectedColor: UiColorDialogColor;
  selectedColorIndex: number;
}

export const initialState: State = {
  colors: [
    {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    },
  ],
  selectedColor: {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  },
  selectedColorIndex: 0,
};

export const reducer = createReducer(
  initialState,
  on(selectColor, (state, { color }) => {
    return {
      ...state,
      ...(color && { selectedColor: color }),
    };
  }),
);

export const selectSelectedColor = (state: State) => state.selectedColor;
