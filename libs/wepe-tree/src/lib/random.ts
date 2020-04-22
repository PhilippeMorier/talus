// https://github.com/davidbau/seedrandom

import { alea, prng, State } from 'seedrandom';

let aleaNumberGenerator: prng;
createNumberGenerator('initialDefaultSeed');

export function createNumberGenerator(seed: string): void {
  // specify "state" option, so that prng gets a state() method that returns a plain object
  // the can be used to reconstruct a prng later in the same state
  // https://github.com/davidbau/seedrandom#saving-and-restoring-prng-state

  aleaNumberGenerator = alea(seed, { state: true });
}

export function randomInRange(lower: number, upper: number): number {
  return lower + (upper - lower) * this.random();
}

export function random(): number {
  return aleaNumberGenerator();
}

export function getNumberGeneratorState(): State {
  return aleaNumberGenerator.state();
}

export function setNumberGeneratorState(state: State): void {
  aleaNumberGenerator = alea('', { state });
}
