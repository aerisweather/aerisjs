/**
 * @fileoverview Defines the APIReponseError class.
*/
define(['aeris', 'aeris/errors/abstracterror'], function(aeris, AbstractError) {
  aeris.provide('aeris.errors.TimeoutError');


  /**
   * TimeoutError
   *
   * Use when:
   *  - Someone your waiting on never shows up.
   *
   * @constructor
   * @extends {aeris.errors.AbstractError}
   * @override
   */
  aeris.errors.TimeoutError = function() {
    AbstractError.apply(this, arguments);
  };

  aeris.inherits(
    aeris.errors.TimeoutError,
    AbstractError
  );


  /**
   * @override
   */
  aeris.errors.TimeoutError.prototype.setName = function() {
    return 'TimeoutError';
  };


  return aeris.errors.TimeoutError;
});
