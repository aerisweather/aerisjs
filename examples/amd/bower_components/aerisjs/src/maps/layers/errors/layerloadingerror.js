define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class LayerLoadingError
   * @namespace aeris.maps.layers.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'LayerLoadingError'
  });
});
