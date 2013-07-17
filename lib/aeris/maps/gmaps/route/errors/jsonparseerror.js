/**
 * @fileoverview Defines the {aeris.maps.gmaps.route.errors.JSONParseError}
 * custom Error class.
 */
define(['aeris', 'aeris/errors/abstracterror'], function(aeris) {
  aeris.provide('aeris.maps.gmaps.route.errors.JSONParseError');


  /**
   * Error thrown when unable to parse a JSON route
   *
   * @extends {aeris.errors.AbstractError}
   * @constructor
   */
  aeris.maps.gmaps.route.errors.JSONParseError = function() {
    aeris.errors.AbstractError.apply(this, arguments);
  };
  aeris.inherits(
    aeris.maps.gmaps.route.errors.JSONParseError,
    aeris.errors.AbstractError
  );

  aeris.maps.gmaps.route.errors.JSONParseError.prototype.setName = function() {
    return 'JSONParseError';
  };

  aeris.maps.gmaps.route.errors.JSONParseError.prototype.setMessage = function(message) {
    return 'Unable to parse JSON route: ' + message;
  };

  return aeris.maps.gmaps.route.errors.JSONParseError;
});
