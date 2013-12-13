define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * @class aeris.directions.errors.ServiceUnavailableError
   * @extends aeris.errors.AbstractError
   *
   * @constructor
   * @override
  */
  var ServiceUnavailableError = function() {
    AbstractError.apply(this, arguments);
  };
  _.inherits(ServiceUnavailableError, AbstractError);


  /** @override */
  ServiceUnavailableError.prototype.setName = function() {
    return 'ServiceUnavailableError';
  };


  return ServiceUnavailableError;
});
