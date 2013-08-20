define([
  'aeris/util', 'base/map', './mapoptions', './layermanager', './eventmanager'
],function(_) {

  /**
   * @fileoverview Aeris Maps' wrapper of OpenLayers.
   */


  _.provide('aeris.maps.openlayers.Map');


  /**
   * Wraps OpenLayers' map.
   *
   * @constructor
   * @extends {aeris.maps.Map}
   */
  aeris.maps.openlayers.Map = function(div, options) {
    aeris.maps.Map.call(this, div, options);
  };
  _.inherits(aeris.maps.openlayers.Map, aeris.maps.Map);


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
  aeris.maps.openlayers.Map.prototype.eventManagerClass =
      aeris.maps.openlayers.EventManager;


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


  /**
   * @override
   */
  aeris.maps.Map.prototype.initializedEvent = function(map, fn) {
    var layerCallback = function(event) {
      event.object.events.unregister('loadend', this, layerCallback);
      map.events.unregister('changebaselayer', this, mapCallback);
      fn();
    };
    var mapCallback = function(event) {
      if (event.layer.name.match(/Google/)) {
        map.events.unregister('changebaselayer', this, mapCallback);
        fn();
      }
      event.layer.events.register('loadend', this, layerCallback);
    };
    map.events.register('changebaselayer', this, mapCallback);
  };


  return aeris.maps.openlayers.Map;

});
