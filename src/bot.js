import { randomItem } from './utils/random.js';

/** The bot commits to a card without seeing the player's choice, so the round stays fair. */
export function chooseBotCard(hand) {
  return randomItem(hand);
}
