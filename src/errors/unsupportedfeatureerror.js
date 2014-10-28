define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * An attempt has been made to use a feature
   * which is not currently supported by the Aeris.js
   * library.
   *
   * @class aeris.errors.UnsupportedFeatureError
   * @extends aeris.errors.AbstractError
   */
  return new ErrorTypeFactory({
    name: 'UnsupportedFeatureError'
  });
});
