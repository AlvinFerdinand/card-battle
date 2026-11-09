import { MATCH } from '../config.js';
import { DecidedBy, Outcome } from '../rules.js';
import { categoryLabel, createCardBack, createCardElement } from './card-element.js';

const DROP_HINT = 'Seret kartu ke arena';

const OUTCOME_HEADLINE = Object.freeze({
  [Outcome.WIN]: 'Kamu menang ronde ini!',
  [Outcome.LOSE]: 'Bot menang ronde ini.',
  [Outcome.DRAW]: 'Seri.',
});

/** Renders match state into the DOM. Holds no game state of its own. */
export class TableView {
  constructor(root) {
    this.playerHand = root.querySelector('[data-player-hand]');
    this.botHand = root.querySelector('[data-bot-hand]');
    this.arena = root.querySelector('[data-arena]');
    this.playerSlot = root.querySelector('[data-player-slot]');
    this.botSlot = root.querySelector('[data-bot-slot]');
    this.message = root.querySelector('[data-message]');
    this.playerScore = root.querySelector('[data-player-score]');
    this.botScore = root.querySelector('[data-bot-score]');
    this.round = root.querySelector('[data-round]');
  }

  renderMatch({ playerHand, botHand, scores, roundsPlayed }) {
    this.playerHand.replaceChildren(...playerHand.map(createCardElement));
    this.botHand.replaceChildren(...botHand.map(createCardBack));
    this.playerScore.textContent = scores.player;
    this.botScore.textContent = scores.bot;
    this.round.textContent = `Ronde ${Math.min(roundsPlayed + 1, MATCH.handSize)}`;
  }

  showDuel(result) {
    const botCard = createCardElement(result.botCard);
    botCard.classList.add('is-revealed');

    this.playerSlot.replaceChildren(createCardElement(result.playerCard));
    this.botSlot.replaceChildren(botCard);
    this.message.textContent = `${OUTCOME_HEADLINE[result.outcome]} ${describeReason(result)}`;
    this.arena.dataset.outcome = result.outcome;
  }

  clearArena() {
    this.playerSlot.replaceChildren();
    this.botSlot.replaceChildren();
    this.message.textContent = DROP_HINT;
    delete this.arena.dataset.outcome;
  }

  setDropTargetActive(isActive) {
    this.arena.classList.toggle('is-drop-target', isActive);
  }

  setInteractive(isInteractive) {
    this.playerHand.classList.toggle('is-locked', !isInteractive);
  }
}

function describeReason({ playerCard, botCard, outcome, decidedBy }) {
  const [winner, loser] = outcome === Outcome.LOSE ? [botCard, playerCard] : [playerCard, botCard];

  switch (decidedBy) {
    case DecidedBy.CATEGORY:
      return `${categoryLabel(winner.category)} mengalahkan ${categoryLabel(loser.category)}.`;
    case DecidedBy.VALUE:
      return `Sama-sama ${categoryLabel(winner.category)}, nilai ${winner.value} lebih besar dari ${loser.value}.`;
    default:
      return 'Kategori dan nilai kartu sama.';
  }
}
