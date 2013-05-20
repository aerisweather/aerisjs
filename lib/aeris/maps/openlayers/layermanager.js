define([
  'aeris',
  'base/layermanager',
  './layerstrategies/osm',
  './layerstrategies/tile',
  './layerstrategies/aerisinteractivetile',
  './layerstrategies/googlemaptype',
  './layerstrategies/kml',
  './layerstrategies/infobox'
],
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
    'OSM': aeris.maps.openlayers.layerstrategies.OSM,
    'Tile': aeris.maps.openlayers.layerstrategies.Tile,
    'AerisInteractiveTile':
        aeris.maps.openlayers.layerstrategies.AerisInteractiveTile,
    'GoogleMapType': aeris.maps.openlayers.layerstrategies.GoogleMapType,
    'KML': aeris.maps.openlayers.layerstrategies.KML,
    'InfoBox': aeris.maps.openlayers.layerstrategies.InfoBox
  };


  return aeris.maps.openlayers.LayerManager;

});
