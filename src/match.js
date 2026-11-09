import { chooseBotCard } from './bot.js';
import { dealHand } from './cards.js';
import { MATCH } from './config.js';
import { Outcome, resolveDuel } from './rules.js';

export const MatchStatus = Object.freeze({
  PLAYING: 'playing',
  PLAYER_WON: 'player-won',
  BOT_WON: 'bot-won',
  DRAW: 'draw',
});

/**
 * Holds the state of one match and enforces its rules. Dealing and the bot's
 * choice are injectable so the match can be tested deterministically.
 */
export class Match {
  constructor({ deal = dealHand, chooseCard = chooseBotCard } = {}) {
    this.deal = deal;
    this.chooseCard = chooseCard;
    this.start();
  }

  get isOver() {
    return this.status !== MatchStatus.PLAYING;
  }

  start() {
    this.playerHand = this.deal('player');
    this.botHand = this.deal('bot');
    this.scores = { player: 0, bot: 0 };
    this.roundsPlayed = 0;
    this.status = MatchStatus.PLAYING;
  }

  playRound(playerCardId) {
    if (this.isOver) throw new Error('The match is already over.');

    const playerCard = takeCard(this.playerHand, playerCardId);
    const botCard = takeCard(this.botHand, this.chooseCard(this.botHand).id);
    const duel = resolveDuel(playerCard, botCard);

    if (duel.outcome === Outcome.WIN) this.scores.player += 1;
    if (duel.outcome === Outcome.LOSE) this.scores.bot += 1;

    this.roundsPlayed += 1;
    this.status = this.evaluateStatus();

    return { playerCard, botCard, ...duel };
  }

  /**
   * First to the winning score takes the match. Draws award no points, so the
   * hands can run out first; the higher score then wins, or the match is drawn.
   */
  evaluateStatus() {
    const { player, bot } = this.scores;

    if (player >= MATCH.winningScore) return MatchStatus.PLAYER_WON;
    if (bot >= MATCH.winningScore) return MatchStatus.BOT_WON;
    if (this.playerHand.length > 0) return MatchStatus.PLAYING;

    if (player > bot) return MatchStatus.PLAYER_WON;
    if (bot > player) return MatchStatus.BOT_WON;
    return MatchStatus.DRAW;
  }
}

function takeCard(hand, cardId) {
  const index = hand.findIndex((card) => card.id === cardId);
  if (index === -1) throw new Error(`Card "${cardId}" is not in this hand.`);
  return hand.splice(index, 1)[0];
}
