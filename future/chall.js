/**
 * Not to be taken seriously
 */
export const leftPad = R.curry((ch, num, str) => R.compose(R.join(''), R.append(str), R.repeat(ch))(num - str.length));

/**
 * Not to be taken seriously
 */
export const rightPad = R.curry((ch, num, str) => R.compose(R.join(''), R.prepend(str), R.repeat(ch))(num - str.length));

/**
 * Not to be taken seriously
 */
export const wipeKeys = R.chain(R.omit, R.keys);

/**
 * Not to be taken seriously
 */
export const allValues = R.chain(R.assoc('values'), R.values);

/**
 * Not to be taken seriously
 */
export const fn = R.compose(R.map, R.zipWith(R.call));

/**
 * Not to be taken seriously
 */
export const betterLog = arr => arr.map(R.unary(console.log));
