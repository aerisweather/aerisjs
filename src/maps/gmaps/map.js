define([
  'aeris/util',
  'aeris/util/gmaps',
  'aeris/maps/strategy/abstractstrategy',
  'aeris/maps/layers/googleroadmap',
  'googlemaps!'
], function(_, mapUtil, AbstractStrategy, GoogleRoadMap, gmaps) {
  /**
   * A strategy for rendering a Google Maps map.
   *
   * @param {aeris.maps.Map} mapObject
   * @class Map
   * @namespace aeris.maps.gmaps
   * @extends aeris.maps.gmaps.AbstractStrategy
   * @constructor
   */
  var GoogleMapStrategy = function(mapObject) {
    AbstractStrategy.apply(this, arguments);

    this.bindMapEvents_();

    // Sync map view with map object.
    this.listenTo(this.object_, {
      'change:center': this.updateCenter_,
      'change:zoom': this.updateZoom_
    }, this);

    // Make sure all attributes are in sync
    // on init. If pre-existing google.maps.Map object was
    // injected as our view, we need to make sure our aeris.maps.Map
    // object is updated.
    this.updateObjectFromView_();

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
   * @method createView_
   */
  GoogleMapStrategy.prototype.createView_ = function() {
    var el = this.object_.getElement();
    var view;

    // Accept a predefined google.maps.Map
    // object
    if (el instanceof gmaps.Map) {
      return el;
    }

    gmaps.visualRefresh = true;
    view = new gmaps.Map(el, {
      center: mapUtil.arrayToLatLng(this.object_.get('center')),
      zoom: this.object_.get('zoom'),
      scrollwheel: this.object_.get('scrollZoom')
    });

    return view;
  };


  GoogleMapStrategy.prototype.bindMapEvents_ = function() {
    this.googleEvents_.listenTo(this.getView(), {
      // Proxy view events to map object.
      click: _.bind(this.triggerMouseEvent_, this, 'click'),
      dblclick: _.bind(this.triggerMouseEvent_, this, 'dblclick'),
      tilesloaded: _.bind(this.object_.trigger, this.object_, 'load'),

      // Update the MapExtObj center attr
      center_changed: function() {
        var latLon = mapUtil.latLngToArray(this.getView().getCenter());
        this.object_.set('center', latLon, { validate: true });
      },

      idle: function() {
        var aerisBounds;
        var gBounds = this.getView().getBounds();

        if (!gBounds) { return; }
        aerisBounds = mapUtil.boundsToArray(gBounds);
        this.object_.set('bounds', aerisBounds, { validate: true });
      },

      zoom_changed: function() {
        var zoom = this.getView().getZoom();
        this.object_.set('zoom', zoom, { validate: true });
      }
    }, this);
  };

  GoogleMapStrategy.prototype.triggerMouseEvent_ = function(topic, evtObj) {
    var latLon = mapUtil.latLngToArray(evtObj.latLng);
    this.object_.trigger(topic, latLon);
  };


  /**
   * @private
   * @method updateCenter_
   */
  GoogleMapStrategy.prototype.updateCenter_ = function() {
    var latLng = mapUtil.arrayToLatLng(this.object_.get('center'));

    this.getView().setCenter(latLng);
  };


  /**
   * @method updateAllAttributes_
   * @private
   */
  GoogleMapStrategy.prototype.updateObjectFromView_ = function() {
    this.object_.set({
      center: this.getView().getCenter(),
      zoom: this.getView().getZoom(),
      scrollZoom: this.getView().scrollwheel
    });
  };


  /**
   * @private
   * @method updateZoom_
   */
  GoogleMapStrategy.prototype.updateZoom_ = function() {
    var zoom = this.object_.get('zoom');
    this.getView().setZoom(zoom);
  };


  GoogleMapStrategy.prototype.fitToBounds = function(bounds) {
    var gBounds = mapUtil.arrayToBounds(bounds);
    this.view_.fitBounds(gBounds);
  };


  return GoogleMapStrategy;
});
