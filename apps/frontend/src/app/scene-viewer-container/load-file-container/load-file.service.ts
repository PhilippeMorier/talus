import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadFileStatus } from './load-file.worker';

@Injectable()
export class LoadFileService {
  private readonly worker?: Worker;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('./load-file.worker', { type: 'module' });
    } else {
      // Add a fallback so that program still executes correctly.
      console.log('Web workers are not supported in this environment.');
    }
  }

  load(file: File): Observable<LoadFileStatus> {
    return new Observable<LoadFileStatus>(subscriber => {
      if (!this.worker) {
        throw new Error('Worker is unavailable. Web workers might be not supported.');
      }

      this.worker.onmessage = ({ data: status }) => {
        subscriber.next(status);

        if (status.progress === 100) {
          subscriber.complete();
        }
      };

      this.worker.postMessage(file);
    });
  }
}
