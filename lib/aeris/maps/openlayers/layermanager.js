define(['aeris', 'base/layermanager', './layermanager/osm'],
function(aeris) {

  /**
   * @fileoverview OpenLayers Layer Manager
   */


  aeris.provide('aeris.maps.openlayers.LayerManager');


  /**
   * A layer manager for binding layers to an openlayers map object.
   *
   * @constructor
   * @extends {aeris.maps.LayerManager}
   */
  aeris.maps.openlayers.LayerManager = function(aerisMap, options) {
    aeris.maps.LayerManager.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.openlayers.LayerManager, aeris.maps.LayerManager);


  /**
   * @override
   */
  aeris.maps.openlayers.LayerManager.prototype.strategies = {
    'OSM': aeris.maps.openlayers.layermanager.OSM
  };


  return aeris.maps.openlayers.LayerManager;

});
