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

/**
 * Not to be taken seriously
 * https://goo.gl/T0CnZ2
 */
const saveEmployee = compose(
  R.chain(setCache, R.path(['id'])),
  // another option
  // R.converge(R.uncurryN(2,setCache), [R.path(['id']), R.identity]),
  R.assoc('role', 'developer'),
  R.path(['employee'])
);
