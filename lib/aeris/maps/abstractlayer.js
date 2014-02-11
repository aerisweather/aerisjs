define([
  'ai/util',
  'ai/maps/extensions/mapextensionobject'
], function(_, MapExtensionObject) {
  /**
   * Base class for all layers.
   *
   * @constructor
   * @class AbstractLayer
   * @namespace aeris.maps
   *
   * @extends aeris.maps.extensions.MapExtensionObject
   * @mixes aeris.Events
   */
  var AbstractLayer = function() {
    MapExtensionObject.apply(this, arguments);
  };
  _.inherits(AbstractLayer, MapExtensionObject);


  return AbstractLayer;

});
