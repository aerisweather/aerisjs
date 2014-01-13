define([
  'errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.errors.InvalidConfigError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'InvalidConfigError'
  });
});