define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.maps.layers.errors.LayerLoadingError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'LayerLoadingError'
  });
});
