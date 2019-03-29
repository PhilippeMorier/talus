import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneService } from './scene.service';
import { ViewportComponent } from './viewport/viewport.component';
import { ViewPortModule } from './viewport/viewport.module';

@NgModule({
  declarations: [AppComponent, ViewportComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    MatButtonModule,
    StoreModule.forRoot({}),
    ViewPortModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
  ],
  providers: [SceneService],
  bootstrap: [AppComponent],
})
export class AppModule {}
