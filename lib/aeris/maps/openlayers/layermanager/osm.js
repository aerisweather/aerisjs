define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting OSM layer with
   * OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layermanager.OSM');


  /**
   * A strategy for support OSM layers with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerManagerStrategy}
   */
  aeris.maps.openlayers.layermanager.OSM = function(aerisMap) {


    aeris.maps.LayerManagerStrategy.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.openlayers.layermanager.OSM,
                 aeris.maps.LayerManagerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.OSM.prototype.setBaseLayer =
      function(layer) {
    if (!layer.openlayers_) {
      layer.openlayers_ = new OpenLayers.Layer.OSM(layer.name, null, {
        transitionEffect: 'resize'
      });
    }

    this.map.addLayer(layer.openlayers_);
    this.map.setBaseLayer(layer.openlayers_);
  };


  return aeris.maps.openlayers.layermanager.OSM;

});

