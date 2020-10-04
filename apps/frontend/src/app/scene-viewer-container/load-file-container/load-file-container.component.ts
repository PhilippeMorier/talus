import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { rgbaToInt } from '@talus/model';
import { finalizeWithValue } from '@talus/shared';
import { UI_OVERLAY_DATA } from '@talus/ui';
import { Coord } from '@talus/vdb';
import { tap } from 'rxjs/operators';
import * as fromApp from '../../app.reducer';
import { setVoxels } from '../scene-viewer-container.actions';
import { LoadFileService } from './load-file.service';

@Component({
  selector: 'fe-load-file-container',
  template: `
    <ui-progress-spinner
      *ngIf="load$ | async"
      [mode]="mode"
      [status]="status"
      [value]="progress"
    ></ui-progress-spinner>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadFileContainerComponent {
  mode: 'indeterminate' | 'determinate' = 'indeterminate';
  progress = 0;
  status = 'Loading file...';

  load$ = this.loadFileService.load(this.data).pipe(
    tap(status => {
      if (status.isConverting) {
        this.mode = 'determinate';
        this.status = 'Converting...';
      }

      this.progress = status.progress;
    }),
    finalizeWithValue(status => {
      this.status = 'Adding voxels...';

      setTimeout(() => {
        const action = getActionFromCoords(status.coords);
        this.store.dispatch(action);

        this.overlayRef.detach();
      }, 500);
    }),
  );

  constructor(
    @Inject(UI_OVERLAY_DATA) private readonly data: File,
    private readonly overlayRef: OverlayRef,
    private readonly store: Store<fromApp.State>,
    private readonly loadFileService: LoadFileService,
  ) {}
}

function getActionFromCoords(coords: Coord[]): Action {
  const colors: number[] = [];
  const defaultColor = rgbaToInt({ r: 0, g: 255, b: 0, a: 255 });
  const scaleFactor = 50;

  for (let i = 0; i < coords.length; i++) {
    coords[i] = {
      x: coords[i].x * scaleFactor,
      y: coords[i].y * scaleFactor,
      z: coords[i].z * scaleFactor,
    };
    colors.push(defaultColor);
  }

  return setVoxels({ coords, newValues: colors, needsSync: true });
}
