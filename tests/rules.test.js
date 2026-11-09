import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Category } from '../src/cards.js';
import { DecidedBy, Outcome, resolveDuel } from '../src/rules.js';

const card = (category, value) => ({ id: `${category}-${value}`, category, value });

describe('resolveDuel', () => {
  it('applies rock-paper-scissors when categories differ, ignoring value', () => {
    const cases = [
      [Category.ROCK, Category.SCISSORS],
      [Category.SCISSORS, Category.PAPER],
      [Category.PAPER, Category.ROCK],
    ];

    for (const [winner, loser] of cases) {
      assert.deepEqual(resolveDuel(card(winner, 1), card(loser, 9)), {
        outcome: Outcome.WIN,
        decidedBy: DecidedBy.CATEGORY,
      });
      assert.deepEqual(resolveDuel(card(loser, 9), card(winner, 1)), {
        outcome: Outcome.LOSE,
        decidedBy: DecidedBy.CATEGORY,
      });
    }
  });

  it('compares values when categories match', () => {
    assert.deepEqual(resolveDuel(card(Category.ROCK, 7), card(Category.ROCK, 4)), {
      outcome: Outcome.WIN,
      decidedBy: DecidedBy.VALUE,
    });
    assert.deepEqual(resolveDuel(card(Category.PAPER, 2), card(Category.PAPER, 3)), {
      outcome: Outcome.LOSE,
      decidedBy: DecidedBy.VALUE,
    });
  });

  it('is a draw when category and value are identical', () => {
    assert.deepEqual(resolveDuel(card(Category.SCISSORS, 5), card(Category.SCISSORS, 5)), {
      outcome: Outcome.DRAW,
      decidedBy: DecidedBy.TIE,
    });
  });
});
