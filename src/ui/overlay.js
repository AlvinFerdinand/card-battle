/** DOM panel for the start and result screens; buttons are easier to tap than canvas UI. */
export class Overlay {
  constructor(root) {
    this.root = root;
    this.title = root.querySelector('[data-overlay-title]');
    this.body = root.querySelector('[data-overlay-body]');
    this.button = root.querySelector('[data-overlay-action]');
    this.action = null;

    this.button.addEventListener('click', () => this.action?.());
  }

  show({ title, lines, actionLabel, onAction }) {
    this.title.textContent = title;
    this.body.replaceChildren(...lines.map(createParagraph));
    this.button.textContent = actionLabel;
    this.action = onAction;
    this.root.hidden = false;
  }

  hide() {
    this.root.hidden = true;
    this.action = null;
  }
}

function createParagraph(text) {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  return paragraph;
}
