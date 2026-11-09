import { CARD_VALUE, MATCH } from './config.js';
import { randomIntInclusive, randomItem } from './utils/random.js';

export const Category = Object.freeze({
  ROCK: 'rock',
  PAPER: 'paper',
  SCISSORS: 'scissors',
});

const CATEGORIES = Object.freeze(Object.values(Category));

/** Deals a hand of random cards. Ids are prefixed by owner so they stay unique across both hands. */
export function dealHand(owner, size = MATCH.handSize) {
  return Array.from({ length: size }, (_, index) => ({
    id: `${owner}-${index}`,
    category: randomItem(CATEGORIES),
    value: randomIntInclusive(CARD_VALUE.min, CARD_VALUE.max),
  }));
}
