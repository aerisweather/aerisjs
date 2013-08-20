define(['aeris/util', 'base/layerstrategy'], function(_) {

  /**
   * @fileoverview Layer manager strategy for supporting a GoogleMapType layer
   *               for Google Maps.
   */


  _.provide('aeris.maps.gmaps.layerstrategies.GoogleMapType');


  /**
   * A strategy for supporting GoogleMapType layers with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.gmaps.layerstrategies.GoogleMapType = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  _.inherits(aeris.maps.gmaps.layerstrategies.GoogleMapType,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.GoogleMapType.prototype.
      createInstanceLayer = function(layer) {
    return layer.mapTypeId;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.GoogleMapType.prototype.
      setBaseInstanceLayer = function(instanceLayer, map) {
    map.setMapTypeId(instanceLayer);
  };


  return aeris.maps.gmaps.layerstrategies.GoogleMapType;

});
