define([
  'ai/util',
  'ai/maps/extension/mapextensionobject'
], function(_, MapExtensionObject) {
  /**
   * Base class for all layers.
   *
   * @constructor
   * @class AbstractLayer
   * @namespace aeris.maps
   *
   * @extends aeris.maps.extension.MapExtensionObject
   * @extends aeris.Events
   */
  var AbstractLayer = function() {
    MapExtensionObject.apply(this, arguments);
  };
  _.inherits(AbstractLayer, MapExtensionObject);


  return AbstractLayer;

});
