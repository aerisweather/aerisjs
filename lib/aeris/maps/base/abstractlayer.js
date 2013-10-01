define([
  'aeris/util',
  'base/extension/mapextensionobject'
], function(_, MapExtensionObject) {
  /**
   * Base class for all layers.
   *
   * @constructor
   * @class aeris.maps.AbstractLayer
   *
   * @extends {aeris.maps.extension.MapExtensionObject}
   * @extends {aeris.Events}
   */
  var AbstractLayer = function() {
    MapExtensionObject.apply(this, arguments);
  };
  _.inherits(AbstractLayer, MapExtensionObject);


  return AbstractLayer;

});
