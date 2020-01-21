import { createReducer, on } from '@ngrx/store';
import { UiColorDialogColor } from '@talus/ui';
import { selectColor } from './options-panel.actions';

export const featureKey = 'optionsPanel';

export interface State {
  selectedColor?: UiColorDialogColor;
}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,
  on(selectColor, (state, { color }) => {
    return {
      ...state,
      selectedColor: color,
    };
  }),
);

export const selectSelectedColor = (state: State) => state.selectedColor;
