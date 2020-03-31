import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiRectangularMarqueeComponent } from './rectangular-marquee.component';

@NgModule({
  declarations: [UiRectangularMarqueeComponent],
  imports: [CommonModule, DragDropModule],
  exports: [UiRectangularMarqueeComponent],
})
export class UiRectangularMarqueeModule {}
