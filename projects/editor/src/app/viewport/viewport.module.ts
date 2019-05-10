import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from './viewport.reducer';

// https://doc.babylonjs.com/features/es6_support
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

@NgModule({
  imports: [StoreModule.forFeature('viewport', reducer)],
})
export class ViewPortModule {}
