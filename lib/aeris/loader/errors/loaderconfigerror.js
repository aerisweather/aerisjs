define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * @class aeris.loader.errors.LoaderConfigError
   * @extends aeris.errors.AbstractError
   *
   * @constructor
   * @override
  */
  var LoaderConfigError = function() {
    AbstractError.apply(this, arguments);
  };
  _.inherits(LoaderConfigError, AbstractError);


  /** @override */
  LoaderConfigError.prototype.setName = function() {
    return 'LoaderConfigError';
  };


  return LoaderConfigError;
});
