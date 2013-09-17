define([
  'aeris/util',
  'aeris/events'
], function(_, Events) {
  /**
   * Creates a new map by instantiating and wrapping an implemented javascript
   * mapping library.
   *
   * @param {string|Node} div The HTML node or string of the node's id for
   *                          displaying the map.
   * @param {Object} options An object of options to be applied and/or
   *                         delegated.
   *
   * @class aeris.maps.AbstractMap
   * @constructor
   */
  var AbstractMap = function(div, options) {
    // Call Events constructor
    Events.call(this);

    /**
     * The map view instance created by
     * the map API.
     *
     * (eg. a google.maps.Map instance)
     *
     * @type {Object}
     */
    this.map = this.createMap(div);


    /**
     * Determine if the map has initialized.
     *
     * @type {aeris.Promise}
     */
    this.initialized = new aeris.Promise();


    this.registerEvents_(this.map);


    /**
     * The layer manager used to support delegation of the map's layers.
     *
     * @type {aeris.maps.LayerManager}
     */
    this.layers = this.createLayerManager(options);


    /**
     * The map options used to support delegation of the map's options.
     *
     * @type {aeris.maps.MapOptions}
     */
    this.options = this.createOptions(options);


    /**
     * The marker manager used to support delegation of the map's markers.
     *
     * @type {aeris.maps.MarkerManager}
     */
    this.markers = this.createMarkerManager(options);


    // Proxy map events
    _.each([
      'click',
      'dblclick'
    ], this.proxyMapEvent_, this);
  };

  // Mixin Aeris.Events
  _.extend(AbstractMap.prototype, Events.prototype);


  /**
   * A constructor of the wrapped javascript mapping library's map class.
   *
   * @protected {Function} An external constructor.
   */
  AbstractMap.prototype.apiMapClass = _.notImplemented('Map.apiMapClass');


  /**
   * Return the map view instance
   * created by the mapping API.
   * @return {Object}
   */
  AbstractMap.prototype.getView = function() {
    return this.map;
  };


  /**
   * Create a new wrapped map.
   *
   * @param {string|Node} div The HTML node or string of the node's id for
   *                          displaying the map.
   * @return {Object} A new wrapped map.
   * @protected
   */
  AbstractMap.prototype.createMap = _.notImplemented('Map.createMap');


  /**
   * An implemented MapOption's constructor used for instantiating a MapOption
   * to delegate map options to.
   *
   * @protected {Function} A MapOption's constructor.
   */
  AbstractMap.prototype.mapOptionsClass =
      _.notImplemented('Map.mapOptionsClass');


  /**
   * Create a new MapOption object.
   *
   * @param {Object} options An object of map options.
   * @return {aeris.maps.MapOption} A new MapOption.
   * @protected
   */
  AbstractMap.prototype.createOptions = function(options) {
    return new this.mapOptionsClass(this, options);
  };


  /**
   * An implemented LayerManager's constructor used for instantiated a
   * LayerManager to delegate layer options to.
   *
   * @type {Function}
   * @protected
   */
  AbstractMap.prototype.layerManagerClass = _.abstractMethod;


  /**
   * An implemented MarkerManager's constructor used for instantiating a
   * MarkerManager to delegate marker control to.
   *
   * @type {Function}
   * @protected
   */
  AbstractMap.prototype.markerManagerClass = _.abstractMethod;


  /**
   * Proxy an event from a map instance
   * so that it fires directly from this aeris map.
   *
   * @throws {aeris.errors.UnimplementedMethodError}
   *        If the logic for proxying the requested the topic has
   *        not been implemented.
   * @method
   * @protected
   * @param {string} topic Event topic.
   */
  AbstractMap.prototype.proxyMapEvent_ = _.abstractMethod;


  /**
   * Create a new LayerManager object.
   *
   * @param {Object} options An object of layer options.
   * @return {aeris.maps.LayoutManager} A new LayoutManager.
   * @protected
   */
  AbstractMap.prototype.createLayerManager = function(options) {
    return new this.layerManagerClass(this, options);
  };


  /**
   * Create a new MarkerManager object.
   *
   * @param {Object} options An object of marker options.
   * @return {aeris.maps.MarkerManager}
   * @protected
   */
  AbstractMap.prototype.createMarkerManager = function(options) {
    return new this.markerManagerClass(this, options);
  };


  /**
   * Convert an array of latitude and longitude to the appropriate wrapped
   * map's lat/lon object.
   *
   * @param {Array} latLon An array of latitude and longitude in the form of
   *                       [-34.123, 145.333].
   * @return {Object} The wrapped map's lat/long object representing the given
   *                  latLong.
   * @public
   */
  AbstractMap.prototype.toLatLon = _.notImplemented('Map.toLatLon');


  /**
   * Register map events.
   *
   * @param {Object} map The Google Map to register the events with.
   * @private
   */
  AbstractMap.prototype.registerEvents_ = function(map) {
    var initialized = this.initialized;
    this.initializedEvent(map, function() {
      initialized.resolve();
    });
  };


  /**
   * Determine when the map is initialized and call the callback function.
   *
   * @param {Object} map The map to determine when initialized.
   * @param {Function} fn The callback function.
   */
  AbstractMap.prototype.initializedEvent = _.abstractMethod;


  return AbstractMap;
});
