import { hot } from 'jasmine-marbles';
import { wentOffline, wentOnline } from './app.actions';
import { AppEffects } from './app.effects';

describe('AppEffects', () => {
  let effects: AppEffects;

  beforeEach(() => {
    effects = new AppEffects();

    Object.defineProperty(navigator, 'onLine', { value: false });
  });

  it('should dispatch `wentOnline` action', () => {
    const expected = hot('a', {
      a: wentOnline(),
    });

    expect(effects.onlineStateChange$).toBeObservable(expected);
  });

  it('should dispatch `wentOffline` action', () => {
    const expected = hot('a', {
      a: wentOffline(),
    });

    expect(effects.onlineStateChange$).toBeObservable(expected);
  });
});
