import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiProgressSpinnerModule } from '@talus/ui';
import { LoadFileService } from './load-file.service';
import { LoadFileContainerComponent } from './load-file-container.component';

@NgModule({
  declarations: [LoadFileContainerComponent],
  imports: [CommonModule, UiProgressSpinnerModule],
  exports: [LoadFileContainerComponent],
  providers: [LoadFileService],
})
export class LoadFileContainerModule {}
