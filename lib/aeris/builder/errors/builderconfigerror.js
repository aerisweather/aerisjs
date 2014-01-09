define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * @class aeris.builder.errors.BuilderConfigError
   * @extends aeris.errors.AbstractError
   *
   * @constructor
   * @override
  */
  var BuilderConfigError = function() {
    AbstractError.apply(this, arguments);
  };
  _.inherits(BuilderConfigError, AbstractError);


  /** @override */
  BuilderConfigError.prototype.setName = function() {
    return 'BuilderConfigError';
  };


  return BuilderConfigError;
});
