define([
  'aeris/util',
  'aeris/maps/extensions/mapextensionobject'
], function(_, MapExtensionObject) {
  /**
   * Base class for all layers.
   *
   * @constructor
   * @class Layer
   * @namespace aeris.maps.layers
   *
   * @extends aeris.maps.extensions.MapExtensionObject
   */
  var Layer = function() {
    MapExtensionObject.apply(this, arguments);
  };
  _.inherits(Layer, MapExtensionObject);


  return Layer;
});
