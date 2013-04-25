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
  aeris.maps.openlayers.layerstrategies.OSM = function(aerisMap, layer, data) {


    aeris.maps.LayerStrategy.call(this, aerisMap, layer, data);

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.OSM,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.OSM.prototype.setBaseLayer =
      function() {
    if (!this.getData('olmap')) {
      this.setData('olmap',
        new OpenLayers.Layer.OSM(this.layer.name, null, {
          transitionEffect: 'resize'
        })
      );
    }

    var olmap = this.getData('olmap');
    this.map.addLayer(olmap);
    this.map.setBaseLayer(olmap);
  };


  return aeris.maps.openlayers.layerstrategies.OSM;

});

