import * as R from 'ramda';

/**
 * Returns `true` if the specified value is equal, in `R.equals` terms, to at
 * least one element of the given list; `false` otherwise.
 *
 * @category List
 * @sig [a] -> a -> Boolean
 * @param {Array} list The array to consider.
 * @param {Object} a The item to compare against.
 * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
 * @example
 *
 *      R.isIn([1, 2, 3], 3); //=> true
 *      R.isIn([1, 2, 3], 4); //=> false
 *      R.isIn([{ name: 'Fred' }], { name: 'Fred' }); //=> true
 *      R.isIn([[42]], [42]); //=> true
 */
export const isIn = R.flip(R.contains);

/**
 * Returns the passed element after logging it into the console
 *
 * @category Logging
 * @sig a -> a
 * @param {Object} object to log
 * @return {Object} passed object
 * @example
 *
 *      R.compose(
 *        R.inc,
 *        peek,
 *        R.inc
 *      )(1); // => returns 3 and logs '2'
)
 */
export const peek = R.tap(console.log);

/**
 * Returns the passed element after logging it into the console with a message
 *
 * @category Logging
 * @sig a -> a -> a
 * @param {string} string to preface log
 * @param {Object} object to log
 * @return {Object} passed object
 * @example
 *
 *      R.compose(
 *        R.inc,
 *        trace('after inc'),
 *        R.inc
 *      )(1); // => returns 3 and logs 'after inc 2'
)
 */
export const trace = msg => R.tap(x => console.log(msg, x));

/**
 * Returns `true` if the second argument is less than the second; `false` otherwise
 *
 * @category Logging
 * @sig a -> a -> Boolean
 * @param {Object}
 * @param {Object}
 * @return {Boolean}
 * @example
 *
 *  const lowerThanTwo = lowerThan(2);
 *  lowerThanTwo(3); // => false
)
 */
export const lowerThan = R.flip(R.lt);
