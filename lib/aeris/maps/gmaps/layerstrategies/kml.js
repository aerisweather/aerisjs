define(['aeris', 'base/layerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for support of KML and GMaps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.KML');


  /**
   * A strategy for support of KML with GMaps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.gmaps.layerstrategies.KML = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.KML,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.KML.prototype.createInstanceLayer =
      function(layer) {
    var instanceLayer = new google.maps.KmlLayer({
      url: layer.url,
      preserveViewport: true
    });
    return instanceLayer;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.KML.prototype.setInstanceLayer =
      function(instanceLayer, map) {
    instanceLayer.setMap(map);
  };


  return aeris.maps.gmaps.layerstrategies.KML;

});
