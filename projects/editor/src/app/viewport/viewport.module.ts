import { NgModule } from '@angular/core';
// https://doc.babylonjs.com/features/es6_support
import '@babylonjs/core/Debug/debugLayer';
// ERROR in node_modules/@babylonjs/core/Engines/engine.d.ts(8,10):
// error TS2305: Module '"./engine"' has no exported member 'IDisplayChangedEventArgs'.
import '@babylonjs/core/Engines/Extensions/engine.webVR';
import '@babylonjs/inspector';
import { StoreModule } from '@ngrx/store';
import { reducer } from './viewport.reducer';

@NgModule({
  imports: [StoreModule.forFeature('viewport', reducer)],
})
export class ViewPortModule {}
