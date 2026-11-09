import { Category } from './cards.js';

export const Outcome = Object.freeze({
  WIN: 'win',
  LOSE: 'lose',
  DRAW: 'draw',
});

export const DecidedBy = Object.freeze({
  CATEGORY: 'category',
  VALUE: 'value',
  TIE: 'tie',
});

const BEATS = Object.freeze({
  [Category.ROCK]: Category.SCISSORS,
  [Category.SCISSORS]: Category.PAPER,
  [Category.PAPER]: Category.ROCK,
});

/**
 * Two-layer comparison from the point of view of `card`:
 * 1. Different categories are decided by rock-paper-scissors.
 * 2. Same category is decided by the higher value.
 * Identical category and value is a draw.
 */
export function resolveDuel(card, opponent) {
  if (card.category !== opponent.category) {
    const outcome = BEATS[card.category] === opponent.category ? Outcome.WIN : Outcome.LOSE;
    return { outcome, decidedBy: DecidedBy.CATEGORY };
  }

  if (card.value !== opponent.value) {
    const outcome = card.value > opponent.value ? Outcome.WIN : Outcome.LOSE;
    return { outcome, decidedBy: DecidedBy.VALUE };
  }

  return { outcome: Outcome.DRAW, decidedBy: DecidedBy.TIE };
}
