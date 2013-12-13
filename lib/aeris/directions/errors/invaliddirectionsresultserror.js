define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * @class aeris.directions.errors.InvalidDirectionsResultsError
   * @extends aeris.errors.AbstractError
   *
   * @constructor
   * @override
  */
  var InvalidDirectionsResultsError = function() {
    AbstractError.apply(this, arguments);
  };
  _.inherits(InvalidDirectionsResultsError, AbstractError);


  /**
   * @override
   */
  InvalidDirectionsResultsError.prototype.setName = function() {
    return 'InvalidDirectionsResultsError';
  };


  return InvalidDirectionsResultsError;
});
