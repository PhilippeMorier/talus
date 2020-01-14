import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SidenavShellModule } from '@talus/ui';
import { AppComponent } from './app.component';
import { AppEffects } from './app.effects';
import { metaReducers, ROOT_REDUCERS } from './app.reducer';
import { MenuBarModule } from './menu-bar/menu-bar.module';
import { SceneViewerContainerModule } from './scene-viewer-container';
import { ToolsPanelModule } from './tools-panel/tools-panel.module';
import { UndoRedoModule } from './undo-redo/undo-redo.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([AppEffects]),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    /**
     * StoreModule.forRoot is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    }),

    MenuBarModule,
    SceneViewerContainerModule,
    SidenavShellModule,
    ToolsPanelModule,
    UndoRedoModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
