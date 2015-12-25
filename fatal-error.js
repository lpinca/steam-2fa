'use strict';

/**
 * Prints an error message and sets the process exit code to 1.
 *
 * @param {String} msg The error message to print
 * @public
 */
function fatalError(msg) {
  console.error('fatal: %s', msg);
  process.exitCode = 1;
}

//
// Expose the `fatalError` function.
//
module.exports = fatalError;
