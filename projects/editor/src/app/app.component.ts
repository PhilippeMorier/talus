import { Component } from '@angular/core';

@Component({
  selector: 'tls-root',
  template: `
    <div class="grid">
      <header role="heading">
        <mat-toolbar>
          <span>Talus</span>
        </mat-toolbar>
      </header>

      <main>
        <tls-editor-shell></tls-editor-shell>
      </main>

      <footer>footer</footer>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}