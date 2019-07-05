import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SceneViewerModule, SidenavShellModule } from '@talus/ui';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),

    SidenavShellModule,
    SceneViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
