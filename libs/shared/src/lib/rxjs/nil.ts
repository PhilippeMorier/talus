import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export declare type Nil = undefined | null;

/**
 * Filters the observable until the value is not null or undefined.
 */
export function notNil<T>(): (o: Observable<Nil | T>) => Observable<NonNullable<T>> {
  return (o: Observable<T | Nil>): Observable<NonNullable<T>> => {
    return o.pipe(filter(v => !isNil(v))) as Observable<NonNullable<T>>;
  };
}

/**
 * Filters the observable until the value is null or undefined.
 */
export function nil<T>(): (o: Observable<Nil | T>) => Observable<Nil> {
  return (o: Observable<T | Nil>): Observable<Nil> => {
    return o.pipe(filter(isNil));
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNil(value: any): boolean {
  return value == null;
}
