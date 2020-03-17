// https://github.com/ReactiveX/rxjs/issues/4803#issuecomment-496711335
import { defer, Observable, ObservedValueOf } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export function finalizeWithValue<T>(
  callback: (value: T) => void,
): (source: Observable<T>) => Observable<ObservedValueOf<Observable<T>>> {
  return (source: Observable<T>) =>
    defer(() => {
      let lastValue: T;
      return source.pipe(
        tap(value => (lastValue = value)),
        finalize(() => callback(lastValue)),
      );
    });
}
