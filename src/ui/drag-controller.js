/**
 * Drag and drop built on Pointer Events instead of the HTML5 Drag and Drop API,
 * which does not fire for touch input on most mobile browsers.
 *
 * Listens on the hand container (event delegation), so cards can be re-rendered
 * freely without re-binding listeners.
 */
export class DragController {
  constructor({ container, dropZone, canDrag, onDrop, onHoverChange }) {
    this.dropZone = dropZone;
    this.canDrag = canDrag;
    this.onDrop = onDrop;
    this.onHoverChange = onHoverChange;
    this.drag = null;
    this.isOverDropZone = false;

    container.addEventListener('pointerdown', (event) => this.handlePointerDown(event));
    container.addEventListener('pointermove', (event) => this.handlePointerMove(event));
    container.addEventListener('pointerup', (event) => this.handlePointerUp(event));
    container.addEventListener('pointercancel', (event) => this.handlePointerCancel(event));
  }

  handlePointerDown(event) {
    if (this.drag || !event.isPrimary || event.button !== 0 || !this.canDrag()) return;

    const element = event.target.closest('[data-card-id]');
    if (!element) return;

    event.preventDefault();
    element.setPointerCapture(event.pointerId);
    element.classList.add('is-dragging');
    this.drag = {
      element,
      cardId: element.dataset.cardId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  }

  handlePointerMove(event) {
    if (!this.isTracking(event)) return;

    const { element, startX, startY } = this.drag;
    element.style.transform = `translate(${event.clientX - startX}px, ${event.clientY - startY}px)`;
    this.setHover(this.isInsideDropZone(event));
  }

  handlePointerUp(event) {
    if (!this.isTracking(event)) return;

    const { cardId } = this.drag;
    const isDropped = this.isInsideDropZone(event);
    this.endDrag();
    if (isDropped) this.onDrop(cardId);
  }

  handlePointerCancel(event) {
    if (this.isTracking(event)) this.endDrag();
  }

  isTracking(event) {
    return this.drag !== null && event.pointerId === this.drag.pointerId;
  }

  isInsideDropZone({ clientX, clientY }) {
    const bounds = this.dropZone.getBoundingClientRect();
    return (
      clientX >= bounds.left &&
      clientX <= bounds.right &&
      clientY >= bounds.top &&
      clientY <= bounds.bottom
    );
  }

  /** A card released outside the drop zone slides back to the hand via a CSS transition. */
  endDrag() {
    const { element } = this.drag;
    element.classList.remove('is-dragging');
    element.style.transform = '';
    this.setHover(false);
    this.drag = null;
  }

  setHover(isOver) {
    if (isOver === this.isOverDropZone) return;
    this.isOverDropZone = isOver;
    this.onHoverChange(isOver);
  }
}
