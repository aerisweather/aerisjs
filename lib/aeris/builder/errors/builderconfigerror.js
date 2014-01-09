define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.builder.errors.BuilderConfigError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'BuilderConfigError'
  });
});
