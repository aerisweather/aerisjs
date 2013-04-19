define(['aeris', 'base/map', './mapoptions', './layermanager'],
function(aeris) {

  /**
   * @fileoverview Aeris Maps' wrapper of OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.Map');


  /**
   * Wraps OpenLayers' map.
   *
   * @constructor
   * @extends {aeris.maps.Map}
   */
  aeris.maps.openlayers.Map = function(div, options) {
    aeris.maps.Map.call(this, div, options);
  };
  aeris.inherits(aeris.maps.openlayers.Map, aeris.maps.Map);


  /**
   * @override
   */
  aeris.maps.openlayers.Map.prototype.apiMapClass = OpenLayers.Map;


  /**
   * @override
   */
  aeris.maps.openlayers.Map.prototype.createMap = function(div) {
    return new this.apiMapClass(div);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.Map.prototype.mapOptionsClass =
      aeris.maps.openlayers.MapOptions;


  /**
   * @override
   */
  aeris.maps.openlayers.Map.prototype.layerManagerClass =
      aeris.maps.openlayers.LayerManager;


  /**
   * @override
   */
  aeris.maps.openlayers.Map.prototype.toLatLon = function(val) {
    if (val instanceof Array) {
      val = new OpenLayers.LonLat(val[1], val[0]);
      val.transform(new OpenLayers.Projection('EPSG:4326'),
                    new OpenLayers.Projection('EPSG:900913'));
    }
    return val;
  };


  return aeris.maps.openlayers.Map;

});
