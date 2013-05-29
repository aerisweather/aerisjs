define(['aeris', 'base/layerstrategy', 'aeris/jsonp', 'aeris/promise'],
function(aeris) {

  /**
   * @fileoverview Layer strategy for supporting Aeris Polygons layer with OL.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.AerisPolygons');


  /**
   * A strategy for supporting Aeris Polygons with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.AerisPolygons,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype.
      createInstanceLayer = function(layer) {
    var promise = new aeris.Promise();
    aeris.jsonp.get(layer.url, null, function(data) {
    }, 'C');
    return promise;
  };


  return aeris.maps.openlayers.layerstrategies.AerisPolygons;

});
