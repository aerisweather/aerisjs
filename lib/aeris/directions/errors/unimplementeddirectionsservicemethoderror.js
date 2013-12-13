define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * A DirectionsServiceInterface method has not been implemented.
   *
   * @class aeris.directions.errors.UnimplementedDirectionsServiceMethodError
   * @extends {aeris.errors.UnimplementedMethodError}
   *
   * @constructor
   */
  var UnimplementedDirectionsServiceMethodError = function() {
    AbstractError.apply(this, arguments);
  };
  _.inherits(UnimplementedDirectionsServiceMethodError, AbstractError);


  /**
   * @override
   */
  UnimplementedDirectionsServiceMethodError.prototype.setName = function() {
    return 'UnimplementedDirectionsServiceMethodError';
  };


  /**
   * @override
   * @param {string} opt_methodName The name of the unimplemented method.
   */
  UnimplementedDirectionsServiceMethodError.prototype.setMessage = function(opt_methodName) {
    var errorMsgDefault = 'DirectionsServiceInterface has not been fully implemented.';

    return opt_methodName ?
      errorMsgDefault :
      'Classes implementing the DirectionsServiceInterface' +
        'must implement a ' + opt_methodName + ' method.'
  };


  return UnimplementedDirectionsServiceMethodError;
});
