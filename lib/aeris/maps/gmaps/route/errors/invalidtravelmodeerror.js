define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * @class aeris.maps.gmaps.route.errors.InvalidTravelModeError
   * @extends aeris.errors.AbstractError
   *
   * @constructor
   * @override
  */
  var InvalidTravelModeError = function() {
    AbstractError.apply(this, arguments);
  };
  _.inherits(InvalidTravelModeError, AbstractError);


  /** @override */
  InvalidTravelModeError.prototype.setName = function() {
    return 'InvalidTravelModeError';
  };


  return InvalidTravelModeError;
});
