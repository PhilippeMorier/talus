import { createAction, props } from '@ngrx/store';
import { PointerButton } from './pointer-button.model';

export const pointerPick = createAction(
  '[SceneViewerContainer] Pointer pick',
  props<{ pointerButton: PointerButton }>(),
);
