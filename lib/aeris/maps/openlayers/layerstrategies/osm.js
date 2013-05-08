define(['aeris', 'base/layerstrategy', './mixins/default'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting OSM layer with
   * OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.OSM');


  /**
   * A strategy for support OSM layers with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.openlayers.layerstrategies.mixins.Default}
   */
  aeris.maps.openlayers.layerstrategies.OSM = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.OSM,
                 aeris.maps.LayerStrategy);
  aeris.extend(aeris.maps.openlayers.layerstrategies.OSM.prototype,
               aeris.maps.openlayers.layerstrategies.mixins.Default);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.OSM.prototype.
      createInstanceLayer = function(layer) {
    var instanceLayer = new OpenLayers.Layer.OSM(
      layer.name, null,
      {
        transitionEffect: 'resize'
      });
    return instanceLayer;
  };


  return aeris.maps.openlayers.layerstrategies.OSM;

});

