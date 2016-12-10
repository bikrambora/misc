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
