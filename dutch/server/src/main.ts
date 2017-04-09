// Below is an example of using TSLint errors suppression

/**
 * Returns a string that resolves after given time.
 *
 * @param {string} name - Somebody's name
 * @returns {string}
 */
function delayedHello(name: string): string {
  // tslint:disable-next-line no-string-based-set-timeout
  return `Hello, ${name}`;
}

export default async function greeter(name) { // tslint:disable-line
  return await delayedHello(name);
}

greeter('some name');
