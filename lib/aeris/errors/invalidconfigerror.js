define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  var InvalidConfigError = function() {
    AbstractError.apply(this, arguments);
  };

  _.inherits(InvalidConfigError, AbstractError);

  InvalidConfigError.prototype.setName = function() {
    return 'InvalidConfigError';
  };

  return InvalidConfigError;
});
