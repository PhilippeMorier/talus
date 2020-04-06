import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiProgressSpinnerModule } from '@talus/ui';
import { LoadFileContainerComponent } from './load-file-container.component';
import { LoadFileService } from './load-file.service';

@NgModule({
  declarations: [LoadFileContainerComponent],
  imports: [CommonModule, UiProgressSpinnerModule],
  exports: [LoadFileContainerComponent],
  providers: [LoadFileService],
})
export class LoadFileContainerModule {}
