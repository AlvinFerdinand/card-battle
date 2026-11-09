export const randomInt = (maxExclusive) => Math.floor(Math.random() * maxExclusive);

export const randomIntInclusive = (min, max) => min + randomInt(max - min + 1);

export const randomItem = (items) => items[randomInt(items.length)];
