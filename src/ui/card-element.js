import { Category } from '../cards.js';

const CATEGORY_DISPLAY = Object.freeze({
  [Category.ROCK]: { label: 'Batu', icon: '✊' },
  [Category.PAPER]: { label: 'Kertas', icon: '✋' },
  [Category.SCISSORS]: { label: 'Gunting', icon: '✌️' },
});

export const categoryLabel = (category) => CATEGORY_DISPLAY[category].label;

export function createCardElement({ id, category, value }) {
  const { label, icon } = CATEGORY_DISPLAY[category];
  const element = document.createElement('div');
  element.className = `card card--${category}`;
  element.dataset.cardId = id;
  element.setAttribute('aria-label', `${label} ${value}`);

  element.append(
    createPart('card-value', String(value)),
    createPart('card-icon', icon),
    createPart('card-label', label),
  );
  return element;
}

export function createCardBack() {
  const element = document.createElement('div');
  element.className = 'card-back';
  return element;
}

function createPart(className, text) {
  const part = document.createElement('span');
  part.className = className;
  part.textContent = text;
  return part;
}
