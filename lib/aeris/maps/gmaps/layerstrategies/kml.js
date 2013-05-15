define(['aeris', 'base/layerstrategy', './mixins/div'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for support of KML and GMaps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.KML');


  /**
   * A strategy for support of KML with GMaps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.layerstrategies.mixins.Div}
   */
  aeris.maps.gmaps.layerstrategies.KML = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.KML,
                 aeris.maps.LayerStrategy);
  aeris.extend(aeris.maps.gmaps.layerstrategies.KML.prototype,
               aeris.maps.gmaps.layerstrategies.mixins.Div);


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


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.KML.prototype.getDiv = function(map) {
    var panes = map.getPanes();
    var div = panes.overlayLayer.lastChild;
    panes.overlayLayer.removeChild(div);
    panes.mapPane.appendChild(div);
    return div;
  };


  return aeris.maps.gmaps.layerstrategies.KML;

});
