import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneService } from './scene.service';
import { ViewportComponent } from './viewport/viewport.component';

@NgModule({
  declarations: [AppComponent, ViewportComponent],
  imports: [BrowserModule, AppRoutingModule, MatButtonModule],
  providers: [SceneService],
  bootstrap: [AppComponent],
})
export class AppModule {}
