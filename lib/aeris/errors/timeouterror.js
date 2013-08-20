/**
 * @fileoverview Defines the APIReponseError class.
*/
define(['aeris/util', 'aeris/errors/abstracterror'], function(_, AbstractError) {
  _.provide('aeris.errors.TimeoutError');


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

  _.inherits(
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
