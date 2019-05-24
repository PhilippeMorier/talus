import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EditorShellComponent } from './editor-shell.component';
import { ViewPortModule } from './viewport/viewport.module';

@NgModule({
  declarations: [EditorShellComponent],
  exports: [EditorShellComponent],
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,

    ViewPortModule,
  ],
})
export class EditorShellModule {}
