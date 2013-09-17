/**
 * @fileoverview Defines the APIReponseError class.
*/
define(['aeris/util', 'aeris/errors/abstracterror'], function(_, AbstractError) {
  _.provide('aeris.errors.APIResponseError');


  /**
   * APIResponse Error
   *
   * Use when:
   *  - An API request responds with an HTTP error code
   *  - An API request responds with an error message
   *  - An API request responds with unexpected data
   *
   * @constructor
   * @class aeris.errors.APIResponseError
   * @extends {aeris.errors.AbstractError}
   * @override
   */
  aeris.errors.APIResponseError = function() {
    AbstractError.apply(this, arguments);
  };

  _.inherits(
    aeris.errors.APIResponseError,
    AbstractError
  );


  /**
   * @override
   */
  aeris.errors.APIResponseError.prototype.setName = function() {
    return 'APIResponseError';
  };


  return aeris.errors.APIResponseError;
});
