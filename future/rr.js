import R from 'ramda';

/**
 * Returns `true` if the specified value is equal, in `R.equals` terms, to at
 * least one element of the given list; `false` otherwise.
 *
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
 * @sig a -> a -> Boolean
 * @param {Object}
 * @param {Object}
 * @return {Boolean}
 * @example
 *
 *  const lessThanTwo = lessThan(2);
 *  lessThanTwo(3); // => false
)
 */
export const lessThan = R.flip(R.lt);

/**
 * Returns `true` if the second argument is greater than the second; `false` otherwise
 *
 * @sig a -> a -> Boolean
 * @param {Object}
 * @param {Object}
 * @return {Boolean}
 * @example
 *
 *  const greaterThanTwo = greaterThan(2);
 *  greaterThanTwo(3); // => true
)
 */
export const greaterThan = R.flip(R.gt);

/**
 * Returns trims and slugifies the target string
 *
 * @sig String -> String
 * @param {String}
 * @return {String}
 * @example
 *
 *  const str = ' g a a ';
 *  slugify(str); // => 'g-a-a'
)
 */
export const slugify = R.compose(R.replace(/ /g, '-'), R.trim);

/**
 * Returns a capitalized version of the passed string
 *
 * @sig String -> String
 * @param {String}
 * @return {String}
 * @example
 *
 *  const str = 'abc';
 *  capitalize(str); // => 'Abc'
)
 */
export const capitalize = compose(R.join(''), R.over(R.lensIndex(0), R.toUpper));

/**
 * Returns a decapitalized version of the passed string
 *
 * @sig String -> String
 * @param {String}
 * @return {String}
 * @example
 *
 *  const str = 'Abc';
 *  decapitalize(str); // => 'abc'
)
 */
export const decapitalize = compose(R.join(''), R.over(R.lensIndex(0), R.toLower));

/**
 * Returns a snakeCased version of the passed string
 *
 * @sig String|[String] -> String
 * @param {String|[String]}
 * @return {String}
 * @example
 *
 *  const str = 'a b c';
 *  snakeCase(str); // => 'a_b_c'
 *  const arr = ['a', 'b', 'c'];
 *  snakeCase(arr); // => 'a_b_c'
)
 */
export const snakeCase = R.compose(R.join('_'), R.map(R.toLower), R.when(R.is(String), R.split(' ')));

/**
 * Returns a pascalCased version of the passed string
 *
 * @sig String|[String] -> String
 * @param {String|[String]}
 * @return {String}
 * @example
 *
 *  const str = 'ab cd ef';
 *  pascalCase(str); // => 'AbCdEf'
 *  const arr = ['ab', 'cd', 'ef'];
 *  pascalCase(arr); // => 'AbCdEf'
)
 */
export const pascalCase = R.compose(R.join(''), R.map(R.compose(capitalize, R.toLower)), R.when(R.is(String), R.split(' ')));

/**
 * Returns a camelCased version of the passed string
 *
 * @sig String|[String] -> String
 * @param {String|[String]}
 * @return {String}
 * @example
 *
 *  const str = 'ab cd ef';
 *  camelCase(str); // => 'abCdEf'
 *  const arr = ['ab', 'cd', 'ef'];
 *  camelCase(arr); // => 'abCdEf'
)
 */
export const camelCase = R.compose(decapitalize, R.join(''), R.map(R.compose(capitalize, R.toLower)), R.when(R.is(String), R.split(' ')));

/**
 * Returns a kebabCased version of the passed string
 *
 * @sig String|[String] -> String
 * @param {String|[String]}
 * @return {String}
 * @example
 *
 *  const str = 'a b c';
 *  kebabCase(str); // => 'a-b-c'
 *  const arr = ['a', 'b', 'c'];
 *  kebabCase(arr); // => 'a-b-c'
)
 */
export const kebabCase = R.compose(R.join('-'), R.map(R.toLower), R.when(R.is(String), R.split(' ')));

/**
 * Inserts a character at the specified index
 *
 * @sig Number -> String -> String
 * @param {Number}
 * @param {String}
 * @return {String}
 * @example
 *
 *  const str = 'abcde';
 *  insertAt(2, 'x', str); // => 'abxcde'
)
 */
export const insertAt = R.curry((at, char, str) => R.compose(R.join(''), R.insert(at, char))(str));

/**
 * Transforms a query string into an object
 *
 * @sig String -> Object
 * @param {String}
 * @return {Object}
 * @example
 *
 *  const str = '?a=value&b=another'; // or window.location.search
 *  queryStringToObject(str); // => {"a": "value", "b": "another"}
)
 */
export const queryStringToObject = R.compose(
  R.map(decodeURIComponent),
  R.pickBy((v, k) => k !== ''),
  R.fromPairs,
  R.map(R.split('=')),
  R.split('&'),
  R.replace(/^\?/, '')
);

/**
 * Transforms an object's top level properties into a query string
 *
 * @sig Object -> String
 * @param {Object}
 * @return {String}
 * @example
 *
 *  const obj = {"a": "value", "b": "another"};
 *  objectToQueryString(obj); // => ?a=value&b=another
)
 */
export const objectToQueryString = R.compose(
  R.replace(/(^.+$)/, '?$1'),
  R.join('&'),
  R.map(R.join('=')),
  R.toPairs,
  R.map(encodeURIComponent)
);
