define([
  'aeris/util',
  'gmaps/utils',
  'base/abstractstrategy'
], function(_, mapUtil, AbstractStrategy) {
  /**
   * A strategy for rendering a Google Maps map.
   *
   * @param {aeris.maps.Map} mapObject
   * @class aeris.maps.gmaps.MapStrategy
   * @extends aeris.maps.AbstractStrategy
   * @constructor
   */
  var GoogleMapStrategy = function(mapObject) {
    AbstractStrategy.apply(this, arguments);

    _.each([
      'click',
      'dblclick',
      'load'
    ], this.proxyMapEvent_, this);

    this.object_.on({
      'change:center': this.setCenter_,
      'change:zoom': this.setZoom_,
      'change:baseLayer': this.setBaseLayer_
    }, this);


    // A hack to prevent zoom on dblclick
    // Only if a handler is bound to the 'dblclick' event
    this.object_.on = function(topic, handler) {
      if (_.isString(topic) && topic === 'dblclick' ||
        _.isObject(topic) && _.has(topic, 'dblclick')
        ) {
        this.getView().set('disableDoubleClickZoom', true);
      }

      // Note that we can't pull this in with ReqJS,
      // because we would create a circular dependency.
      // Hacks are fun, no?
      aeris.maps.Map.prototype.on.apply(this, arguments);
    };
  };
  _.inherits(GoogleMapStrategy, AbstractStrategy);


  /**
   * @override
   */
  GoogleMapStrategy.prototype.createView_ = function() {
    var el = this.object_.get('el');
    var view;

    // Convert el as id.
    if (_.isString(el)) {
      el = document.getElementById(this.object_.get('el'));
    }

    google.maps.visualRefresh = true;
    view = new google.maps.Map(el, {
      center: mapUtil.arrayToLatLng(this.object_.get('center')),
      zoom: this.object_.get('zoom')
    });

    // set the base layer
    this.setBaseLayer_();

    return view;
  };


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
  GoogleMapStrategy.prototype.proxyMapEvent_ = function(aerisTopic) {
    var self = this;

    // Aeris topic name --> Google topic name
    var topicLookup = {
      'click': 'click',
      'dblclick': 'dblclick',
      'load': 'tilesloaded'
    };
    var gmapsTopic = topicLookup[aerisTopic];

    // Check that we can bind this topic
    if (!gmapsTopic) {
      throw new UnimplementedMethodError('Unable to proxy \'' + aerisTopic + '\' event for Google map');
    }

    // Bind event
    google.maps.event.addListener(this.getView(), gmapsTopic, function(evt) {
      // Get latLon data from event obj,
      // if it exists
      var latLon = (evt && evt.latLng) ? mapUtil.latLngToArray(evt.latLng) : undefined;

      // Trigger event on aeris map
      self.object_.trigger(aerisTopic, latLon);
    });
  };


  /**
   * @private
   */
  GoogleMapStrategy.prototype.setCenter_ = function() {
    var latLng = mapUtils.arrayToLatLng(this.object_.get('center'));

    this.getView().setCenter(latLng);
  };


  /**
   * @private
   */
  GoogleMapStrategy.prototype.setZoom_ = function() {
    var zoom = this.object_.get('zoom');
    this.getView().setZoom(zoom);
  };


  /**
   * @private
   */
  GoogleMapStrategy.prototype.setBaseLayer_ = function() {
    var baseLayer = this.object_.get('baseLayer');
    baseLayer.setMap(this.object_);
  };


  return GoogleMapStrategy;
});
