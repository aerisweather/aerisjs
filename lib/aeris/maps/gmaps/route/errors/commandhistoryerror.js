/**
 * @fileoverview Defines the {aeris.maps.gmaps.route.errors.CommandHistoryError}
 * custom Error class.
 */
define(['aeris', 'aeris/errors/abstracterror'], function(aeris) {
  aeris.provide('aeris.maps.gmaps.route.errors.CommandHistoryError');


  /**
   * Error thrown when attempting to
   * undo/redo commands that do not exist in command history
   *
   * @extends {aeris.errors.AbstractError}
   * @constructor
   */
  aeris.maps.gmaps.route.errors.CommandHistoryError = function() {
    aeris.errors.AbstractError.apply(this, arguments);
  };
  aeris.inherits(
    aeris.maps.gmaps.route.errors.CommandHistoryError,
    aeris.errors.AbstractError
  );

  aeris.maps.gmaps.route.errors.CommandHistoryError.prototype.setName = function() {
    return 'CommandHistoryError';
  };

  return aeris.maps.gmaps.route.errors.CommandHistoryError;
});
