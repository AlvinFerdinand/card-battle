import { MATCH, UI } from './config.js';
import { Match, MatchStatus } from './match.js';
import { DragController } from './ui/drag-controller.js';
import { Overlay } from './ui/overlay.js';
import { TableView } from './ui/table-view.js';

const RESULT_TITLE = Object.freeze({
  [MatchStatus.PLAYER_WON]: 'Kamu Menang!',
  [MatchStatus.BOT_WON]: 'Bot Menang',
  [MatchStatus.DRAW]: 'Seri',
});

const match = new Match();
const view = new TableView(document.querySelector('[data-table]'));
const overlay = new Overlay(document.querySelector('[data-overlay]'));
let isRevealing = false;

new DragController({
  container: view.playerHand,
  dropZone: view.arena,
  canDrag: () => !match.isOver && !isRevealing,
  onDrop: playCard,
  onHoverChange: (isOver) => view.setDropTargetActive(isOver),
});

view.renderMatch(match);
view.clearArena();
showIntro();

function startMatch() {
  overlay.hide();
  match.start();
  view.renderMatch(match);
  view.clearArena();
  view.setInteractive(true);
}

/** Cards are locked while a duel is revealed so rounds cannot be played over each other. */
function playCard(cardId) {
  const result = match.playRound(cardId);
  view.renderMatch(match);
  view.showDuel(result);

  isRevealing = true;
  view.setInteractive(false);

  setTimeout(() => {
    isRevealing = false;
    view.setInteractive(true);
    if (match.isOver) showResult();
  }, UI.revealDurationMs);
}

function showIntro() {
  overlay.show({
    title: 'Card Battle',
    lines: [
      'Seret satu kartu ke arena untuk melawan kartu bot.',
      'Gunting-batu-kertas menentukan pemenang. Jika kategorinya sama, nilai tertinggi menang.',
      `Pertama mencapai ${MATCH.winningScore} poin memenangkan pertandingan.`,
    ],
    actionLabel: 'Mulai',
    onAction: startMatch,
  });
}

function showResult() {
  const { scores, roundsPlayed, status } = match;
  const lines = [`Skor akhir ${scores.player} - ${scores.bot}`, `Ronde dimainkan: ${roundsPlayed}`];

  if (Math.max(scores.player, scores.bot) < MATCH.winningScore) {
    lines.push('Kartu habis, pemenang ditentukan dari skor tertinggi.');
  }

  overlay.show({
    title: RESULT_TITLE[status],
    lines,
    actionLabel: 'Main Lagi',
    onAction: startMatch,
  });
}
