import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from './viewport.reducer';

@NgModule({
  imports: [StoreModule.forFeature('viewport', reducer)],
})
export class ViewPortModule {}
