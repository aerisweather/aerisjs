define([
  'aeris/util',
  'openlayers/utils',
  'aeris/errors/unimplementedmethoderror',
  'base/abstractmap',
  'openlayers/mapoptions',
  'openlayers/layermanager'
], function(_, mapUtils, UnimplementedMethodError, BaseMap) {
  /**
   * Wraps OpenLayers' map.
   *
   * @constructor
   * @class aeris.maps.openlayers.Map
   * @extends {aeris.maps.AbstractMap}
   */
  var OpenLayersMap = function(div, options) {
    this.apiMapClass = OpenLayers.Map;

    BaseMap.call(this, div, options);
  };
  _.inherits(OpenLayersMap, BaseMap);



  /**
   * @override
   */
  OpenLayersMap.prototype.createMap = function(div) {
    return new this.apiMapClass(div);
  };


  /**
   * @override
   */
  OpenLayersMap.prototype.mapOptionsClass =
      aeris.maps.openlayers.MapOptions;


  /**
   * @override
   */
  OpenLayersMap.prototype.layerManagerClass =
      aeris.maps.openlayers.LayerManager;


  /**
   * @override
   */
  OpenLayersMap.prototype.toLatLon = function(val) {
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
  OpenLayersMap.prototype.initializedEvent = function(map, fn) {
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


  /**
   * @override
   */
  OpenLayersMap.prototype.proxyMapEvent_ = function(aerisTopic) {
    // Handle click events
    if (['click', 'dblclick'].indexOf(aerisTopic) !== -1) {
      this.proxyMapClickEvent_(aerisTopic);
      return;
    }

    throw new UnimplementedMethodError('Unable to proxy \'' + aerisTopic +
      '\' event for OpenLayers map');
  };

  /**
   * Proxy click events triggered by the OpenLayers
   * map instance.
   *
   * @private
   * @param {string} aerisTopic
   */
  OpenLayersMap.prototype.proxyMapClickEvent_ = function(aerisTopic) {
    var control = new OpenLayers.Control();
    var self = this;

    var clickHandler = function(evt) {
      var latLon = (evt && evt.xy) ?
        mapUtils.getLatLonFromEvent(evt, self.map) :
        undefined;

      self.trigger(aerisTopic, latLon);
    };

    var handlerCallbacks = {};
    var handlerOptions = {
      'single': false,
      'double': false,
      'pixelTolerance': 0,
      'stopSingle': false,
      'stopDouble': false
    };

    if (aerisTopic === 'click') {
      handlerCallbacks.click = clickHandler;
      handlerOptions.single = true;
    }
    else if (aerisTopic === 'dblclick') {
      handlerCallbacks.dblclick = clickHandler;
      handlerOptions.double = true;
      handlerOptions.stopDouble = true;
    }

    control.handler = new OpenLayers.Handler.Click(
      control,
      handlerCallbacks,
      handlerOptions
    );

    self.map.addControl(control);
    control.activate();
  };


  return _.expose(OpenLayersMap, 'aeris.maps.openlayers.Map');

});
