import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Category } from '../src/cards.js';
import { Match, MatchStatus } from '../src/match.js';
import { Outcome } from '../src/rules.js';

const { ROCK, PAPER, SCISSORS } = Category;

/** Builds a match with fixed hands; the bot always plays its first remaining card. */
function createMatch(playerCards, botCards) {
  const toHand = (owner, cards) =>
    cards.map(([category, value], index) => ({ id: `${owner}-${index}`, category, value }));

  return new Match({
    deal: (owner) => toHand(owner, owner === 'player' ? playerCards : botCards),
    chooseCard: (hand) => hand[0],
  });
}

function playAll(match) {
  while (!match.isOver) match.playRound(match.playerHand[0].id);
}

describe('Match', () => {
  it('deals six cards to each side', () => {
    const match = new Match();
    assert.equal(match.playerHand.length, 6);
    assert.equal(match.botHand.length, 6);
  });

  it('removes played cards from both hands and scores the winner', () => {
    const match = createMatch(
      [[ROCK, 1], [ROCK, 1], [ROCK, 1], [ROCK, 1], [ROCK, 1], [ROCK, 1]],
      [[SCISSORS, 9], [SCISSORS, 9], [SCISSORS, 9], [SCISSORS, 9], [SCISSORS, 9], [SCISSORS, 9]],
    );

    const result = match.playRound('player-0');

    assert.equal(result.outcome, Outcome.WIN);
    assert.equal(match.playerHand.length, 5);
    assert.equal(match.botHand.length, 5);
    assert.deepEqual(match.scores, { player: 1, bot: 0 });
  });

  it('ends as soon as a side reaches three points', () => {
    const match = createMatch(
      [[PAPER, 1], [PAPER, 1], [PAPER, 1], [PAPER, 1], [PAPER, 1], [PAPER, 1]],
      [[SCISSORS, 1], [SCISSORS, 1], [SCISSORS, 1], [SCISSORS, 1], [SCISSORS, 1], [SCISSORS, 1]],
    );

    playAll(match);

    assert.equal(match.status, MatchStatus.BOT_WON);
    assert.equal(match.roundsPlayed, 3);
    assert.equal(match.playerHand.length, 3);
  });

  it('decides by score when the hands run out before anyone reaches three', () => {
    const match = createMatch(
      [[ROCK, 5], [ROCK, 5], [ROCK, 5], [ROCK, 5], [ROCK, 9], [PAPER, 1]],
      [[ROCK, 5], [ROCK, 5], [ROCK, 5], [ROCK, 5], [ROCK, 1], [SCISSORS, 1]],
    );

    playAll(match);

    assert.equal(match.roundsPlayed, 6);
    assert.deepEqual(match.scores, { player: 1, bot: 1 });
    assert.equal(match.status, MatchStatus.DRAW);
  });

  it('rejects cards that are not in the hand and moves after the match ends', () => {
    const match = createMatch(
      [[ROCK, 9], [ROCK, 9], [ROCK, 9], [ROCK, 9], [ROCK, 9], [ROCK, 9]],
      [[ROCK, 1], [ROCK, 1], [ROCK, 1], [ROCK, 1], [ROCK, 1], [ROCK, 1]],
    );

    assert.throws(() => match.playRound('bot-0'));
    playAll(match);
    assert.equal(match.status, MatchStatus.PLAYER_WON);
    assert.throws(() => match.playRound(match.playerHand[0].id));
  });
});
