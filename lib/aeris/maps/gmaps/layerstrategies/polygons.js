define(['aeris', 'base/layerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Polygons layer with
   *               Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.Polygons');


  /**
   * A strategy for supporting Polygons with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.gmaps.layerstrategies.Polygons = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.Polygons,
                 aeris.maps.LayerStrategy);


  return aeris.maps.gmaps.layerstrategies.Polygon;

});
