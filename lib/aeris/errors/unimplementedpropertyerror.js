define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * UnimplementedPropertyError class
   * Throw when trying to access an abstract method that has not been implemented.
   *
   * @extends {aeris.errors.AbstractError}
   * @constructor
   * @class aeris.errors.UnimplementedPropertyError
   */
  var UnimplementedPropertyError = function() {
    AbstractError.apply(this, arguments);
  };
  _.inherits(UnimplementedPropertyError, AbstractError);


  /**
   * @override
   */
  UnimplementedPropertyError.prototype.setName = function() {
    return 'UnimplementedPropertyError';
  };

  UnimplementedPropertyError.prototype.setMessage = function(message) {
    return message ?
      'Abstract property ' + message + ' has not been implemented' :
      'Abstract property has not been implemented';
  };

  return _.expose(UnimplementedPropertyError, 'aeris.errors.UnimplementedPropertyError');
});
