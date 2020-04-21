// https://github.com/davidbau/seedrandom

import { alea } from 'seedrandom';

let aleaNumberGenerator = alea('initialDefaultSeed');

export function setNumberGeneratorSeed(seed: string): void {
  aleaNumberGenerator = alea(seed);
}

export function randomInRange(lower: number, upper: number): number {
  return lower + (upper - lower) * this.random();
}

export function random(): number {
  return aleaNumberGenerator();
}
