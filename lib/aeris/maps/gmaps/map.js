define([
  'aeris/util',
  'aeris/errors/unimplementedmethoderror',
  'base/abstractmap',
  'gmaps/utils',
  'gmaps/mapoptions',
  'gmaps/layermanager',
  'gmaps/markermanager'
], function(_, UnimplementedMethodError, BaseMap, mapUtil) {
  /**
   * Wraps Google Maps' map.
   *
   * @constructor
   * @class aeris.maps.gmaps.Map
   * @extends {aeris.maps.AbstractMap}
   */
  var GoogleMap = function(div, options) {
    this.apiMapClass = google.maps.Map;

    BaseMap.call(this, div, options);
  };
  _.inherits(GoogleMap, BaseMap);


  /**
   * @override
   */
  GoogleMap.prototype.createMap = function(div) {
    if (typeof div == 'string') {
      div = document.getElementById(div);
    }

    google.maps.visualRefresh = true;
    return new this.apiMapClass(div);
  };


  /**
   * @override
   */
  GoogleMap.prototype.mapOptionsClass = aeris.maps.gmaps.MapOptions;


  /**
   * @override
   */
  GoogleMap.prototype.layerManagerClass =
      aeris.maps.gmaps.LayerManager;


  /**
   * @override
   */
  GoogleMap.prototype.markerManagerClass =
      aeris.maps.gmaps.MarkerManager;


  /**
   * @override
   */
  GoogleMap.prototype.toLatLon = function(latLon) {
    return aeris.maps.gmaps.utils.arrayToLatLng(latLon);
  };


  /**
   * Get the panes for the Google Map.
   *
   * @return {Object}
   */
  GoogleMap.prototype.getPanes = function() {
    var panes = {};
    var nodes =
        this.map.getDiv().childNodes[0].childNodes[0].childNodes[0].childNodes;
    var length = nodes.length;
    for (var i = 0; i < length; i++) {
      var node = nodes[i];
      var zIndex = parseInt(node.style.zIndex);
      if (zIndex == 200) {
        panes.overlayLayer = node;
      } else if (zIndex == 100) {
        panes.mapPane = node;
      }
    }
    return panes;
  };

  /**
   * @override
   */
  GoogleMap.prototype.proxyMapEvent_ = function(aerisTopic) {
    var self = this;

    // Google topic name --> Aeris topic name
    var topicLookup = {
      'click': 'click',
      'dblclick': 'dblclick'
    };
    var gmapsTopic = topicLookup[aerisTopic];

    // Check that we can bind this topic
    if (!gmapsTopic) {
      throw new UnimplementedMethodError('Unable to proxy \'' + aerisTopic + '\' event for Google map');
    }

    // Bind event
    google.maps.event.addListener(this.map, gmapsTopic, function(evt) {
      // Get latLon data from event obj,
      // if it exists
      var latLon = (evt && evt.latLng) ? mapUtil.latLngToArray(evt.latLng) : undefined;

      // Trigger event on aeris map
      self.trigger(aerisTopic, latLon);
    });
  };


  /**
   * @override
   */
  GoogleMap.prototype.on = function(topic, handler) {
    // A hack to prevent zoom on dblclick
    // Only if a handler is bound to the 'dblclick' event
    if (_.isString(topic) && topic === 'dblclick' ||
      _.isObject(topic) && topic.has('dblclick')
    ) {
      this.map.set('disableDoubleClickZoom', true);
    }

    BaseMap.prototype.on.apply(this, arguments);
  };


  /**
   * @override
   */
  GoogleMap.prototype.initializedEvent = function(map, fn) {
    google.maps.event.addListenerOnce(map, 'tilesloaded', fn);
  };


  return _.expose(GoogleMap, 'aeris.maps.gmaps.Map');

});
