import { createAction, props } from '@ngrx/store';
import { UiColorDialogColor, UiColorDialogData } from '@talus/ui';

const actionTypePrefix = `[optionsPanel]`;

export const openColorDialog = createAction(
  `${actionTypePrefix} Open color dialog`,
  props<UiColorDialogData>(),
);
export const openColorDialogFailed = createAction(`${actionTypePrefix} Open color dialog failed`);

export const selectColor = createAction(
  `${actionTypePrefix} Select color`,
  props<{ color?: UiColorDialogColor }>(),
);
