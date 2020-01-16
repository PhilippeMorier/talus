import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { UndoRedoEffects } from './undo-redo.effects';

@NgModule({
  imports: [EffectsModule.forFeature([UndoRedoEffects])],
})
export class UndoRedoModule {}
