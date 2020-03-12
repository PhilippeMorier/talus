import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiFullscreenOverlayService } from './fullscreen-overlay.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    UiFullscreenOverlayService,
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
  ],
})
export class UiFullscreenOverlayModule {}
