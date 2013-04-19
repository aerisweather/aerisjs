define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting OSM layer with
   * OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layermanager.OSM');


  /**
   * A strategy for support OSM layers with OpenLayers.
   *
   * @const
   */
  aeris.maps.openlayers.layermanager.OSM = {};


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.OSM.setBaseLayer = function(map, layer) {
    if (!layer.openlayers_) {
      layer.openlayers_ = new OpenLayers.Layer.OSM("OSM", null, {
        transitionEffect: 'resize'
      });
    }

    map.addLayer(layer.openlayers_);
  };


  return aeris.maps.openlayers.layermanager.OSM;

});

