define(['aeris', 'base/layerstrategy'], function(aeris) {

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
   */
  aeris.maps.openlayers.layerstrategies.OSM = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.OSM,
                 aeris.maps.LayerStrategy);


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


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.OSM.prototype.
      registerInstanceLayer = function(instanceLayer, map) {
    map.addLayer(instanceLayer);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.OSM.prototype.
      setBaseInstanceLayer = function(instanceLayer, map) {
    map.setBaseLayer(instanceLayer);
  };


  return aeris.maps.openlayers.layerstrategies.OSM;

});

