define([
  'aeris/util',
  'gmaps/utils',
  'gmaps/abstractstrategy'
], function(_, mapUtil, AbstractStrategy) {
  /**
   * A strategy for rendering a Google Maps map.
   *
   * @param {aeris.maps.Map} mapObject
   * @class aeris.maps.gmaps.MapStrategy
   * @extends aeris.maps.gmaps.AbstractStrategy
   * @constructor
   */
  var GoogleMapStrategy = function(mapObject) {
    AbstractStrategy.apply(this, arguments);

    this.bindMapEvents_();

    // Sycn map view with map object.
    this.listenTo(this.object_, {
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

      bounds_changed: function() {
        var gBounds = this.getView().getBounds();
        var aerisBounds = mapUtil.boundsToArray(gBounds);
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
   */
  GoogleMapStrategy.prototype.setCenter_ = function() {
    var latLng = mapUtil.arrayToLatLng(this.object_.get('center'));

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
