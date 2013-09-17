define(['aeris/util', 'base/layerstrategy', 'openlayers/layerstrategies/mixins/default'], function(_) {

  /**
   * @fileoverview Layer manager strategy for supporting a GoogleMapType layer
   *               with OpenLayers.
   */


  _.provide('aeris.maps.openlayers.layerstrategies.GoogleMapType');


  /**
   * A strategy for supporting GoogleMapType layers with OpenLayers.
   *
   * @constructor
   * @class aeris.maps.openlayers.layerstrategies.GoogleMapType
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.openlayers.layerstrategies.mixins.Default}
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  _.inherits(aeris.maps.openlayers.layerstrategies.GoogleMapType,
                 aeris.maps.LayerStrategy);
  _.extend(aeris.maps.openlayers.layerstrategies.GoogleMapType.prototype,
               aeris.maps.openlayers.layerstrategies.mixins.Default);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.GoogleMapType.prototype.
      createInstanceLayer = function(layer) {
    var instanceLayer = new OpenLayers.Layer.Google(
      layer.name,
      {
        type: layer.mapTypeId
      });
    return instanceLayer;
  };


  return aeris.maps.openlayers.layerstrategies.GoogleMapType;

});
