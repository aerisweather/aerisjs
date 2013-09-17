define(['aeris/util', 'base/layerstrategy', 'openlayers/layerstrategies/mixins/default'], function(_) {

  /**
   * @fileoverview Layer manager strategy for supporting OSM layer with
   * OpenLayers.
   */


  _.provide('aeris.maps.openlayers.layerstrategies.OSM');


  /**
   * A strategy for support OSM layers with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.openlayers.layerstrategies.mixins.Default}
   */
  aeris.maps.openlayers.layerstrategies.OSM = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  _.inherits(aeris.maps.openlayers.layerstrategies.OSM,
                 aeris.maps.LayerStrategy);
  _.extend(aeris.maps.openlayers.layerstrategies.OSM.prototype,
               aeris.maps.openlayers.layerstrategies.mixins.Default);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.OSM.prototype.
      createInstanceLayer = function(layer) {
    var instanceLayer = new OpenLayers.Layer.OSM(
      layer.name, null,
      {
        transitionEffect: 'resize'
      });
    return instanceLayer;
  };


  return aeris.maps.openlayers.layerstrategies.OSM;

});

