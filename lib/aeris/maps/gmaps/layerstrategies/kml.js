define([
  'aeris/util', 'base/layerstrategy', 'gmaps/layerstrategies/mixins/div',
  'base/layerstrategies/mixins/kml'
], function(_) {

  /**
   * @fileoverview Layer manager strategy for support of KML and GMaps.
   */


  _.provide('aeris.maps.gmaps.layerstrategies.KML');


  /**
   * A strategy for support of KML with GMaps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.layerstrategies.mixins.Div}
   * @extends {aeris.maps.layerstrategies.mixins.KML}
   */
  aeris.maps.gmaps.layerstrategies.KML = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  _.inherits(aeris.maps.gmaps.layerstrategies.KML,
                 aeris.maps.LayerStrategy);
  _.extend(aeris.maps.gmaps.layerstrategies.KML.prototype,
               aeris.maps.gmaps.layerstrategies.mixins.Div);
  _.extend(aeris.maps.gmaps.layerstrategies.KML.prototype,
               aeris.maps.layerstrategies.mixins.KML);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.KML.prototype.createInstanceLayer =
      function(layer) {
    var now = new Date();
    var instanceLayer = new google.maps.KmlLayer({
      url: layer.url + '?' + now.getHours().toString() +
          now.getMinutes().toString(),
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
  aeris.maps.gmaps.layerstrategies.KML.prototype.removeInstanceLayer =
      function(instanceLayer, map) {
    instanceLayer.setMap(null);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.KML.prototype.getDiv = function(map) {
    var panes = map.getPanes();
    var div = null;
    if (panes.overlayLayer.childNodes.length > 0) {
      div = panes.overlayLayer.lastChild;
      panes.overlayLayer.removeChild(div);
      panes.mapPane.appendChild(div);
    }
    return div;
  };


  return aeris.maps.gmaps.layerstrategies.KML;

});
