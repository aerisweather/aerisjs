/**
 * @fileoverview Defines the {aeris.maps.gmaps.route.errors.CommandHistoryError}
 * custom Error class.
 */
define(['aeris/util', 'aeris/errors/abstracterror'], function(_) {
  _.provide('aeris.maps.gmaps.route.errors.CommandHistoryError');


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
  _.inherits(
    aeris.maps.gmaps.route.errors.CommandHistoryError,
    aeris.errors.AbstractError
  );

  aeris.maps.gmaps.route.errors.CommandHistoryError.prototype.setName = function() {
    return 'CommandHistoryError';
  };

  return aeris.maps.gmaps.route.errors.CommandHistoryError;
});
