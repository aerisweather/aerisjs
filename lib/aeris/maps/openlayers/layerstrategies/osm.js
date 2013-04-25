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
  aeris.maps.openlayers.layerstrategies.OSM = function(aerisMap) {


    aeris.maps.LayerStrategy.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.OSM,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.OSM.prototype.setBaseLayer =
      function(layer) {
    if (!layer.openlayers_) {
      layer.openlayers_ = new OpenLayers.Layer.OSM(layer.name, null, {
        transitionEffect: 'resize'
      });
    }

    this.map.addLayer(layer.openlayers_);
    this.map.setBaseLayer(layer.openlayers_);
  };


  return aeris.maps.openlayers.layerstrategies.OSM;

});

