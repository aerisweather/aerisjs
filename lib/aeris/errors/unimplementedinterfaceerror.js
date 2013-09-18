define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * UnimplementedInterfaceError class
   * Throw if sub-class has not fully implemented it's parent's interface
   *
   * @extends {aeris.errors.AbstractError}
   * @constructor
   * @class aeris.errors.UnimplementedInterfaceError
   */
  var UnimplementedInterfaceError = function() {
    AbstractError.apply(this, arguments);
  };
  _.inherits(UnimplementedInterfaceError, AbstractError);


  /**
   * @override
   */
  UnimplementedInterfaceError.prototype.setName = function() {
    return 'UnimplementedInterfaceError';
  };

  UnimplementedInterfaceError.prototype.setMessage = function(message) {
    return message ?
      'Abstract property ' + message + ' has not been implemented' :
      'Interface has not been fully implemented.';
  };

  return _.expose(UnimplementedInterfaceError, 'aeris.errors.UnimplementedInterfaceError');
});
