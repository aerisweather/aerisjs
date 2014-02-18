define([
  'aeris/util',
  'aeris/maps/strategy/abstractstrategy',
  'aeris/maps/strategy/utils',
  'googlemaps!'
], function(_, AbstractStrategy, mapUtil, gmaps) {
  /**
   * Strategy for rendering a Polyline using the
   * Google Maps API.
   *
   * @class Polyline
   * @namespace aeris.maps.gmaps.polylines
   * @extends aeris.maps.gmaps.AbstractStrategy
   *
   * @constructor
   * @override
  */
  var PolylineStrategy = function(object) {
    AbstractStrategy.apply(this, arguments);

    this.bindViewEvents_();


    // Bind view to object
    this.listenTo(this.object_, {
      'change:path': this.updatePath,
      'change:strokeColor': this.updateViewStyle,
      'change:strokeWeight': this.updateViewStyle,
      'change:strokeOpacity': this.updateViewStyle
    });
  };
  _.inherits(PolylineStrategy, AbstractStrategy);


  /**
   * @override
   *
   * @return {google.maps.Polyline}
   * @method createView_
   */
  PolylineStrategy.prototype.createView_ = function() {
    return new gmaps.Polyline({
      path: mapUtil.pathToLatLng(this.object_.get('path')),
      strokeColor: this.object_.get('strokeColor'),
      strokeWeight: this.object_.get('strokeWeight'),
      strokeOpacity: this.object_.get('strokeOpacity')
    });
  };


  /**
   * @method setMap
   */
  PolylineStrategy.prototype.setMap = function(aerisMap) {
    AbstractStrategy.prototype.setMap.apply(this, arguments);

    this.getView().setMap(this.mapView_);
  };


  /**
   * @method beforeRemove_
   */
  PolylineStrategy.prototype.beforeRemove_ = function() {
    this.getView().setMap(null);
  };


  /**
   * Update the view's path
   * to match the MapObject
   * @method updatePath
   */
  PolylineStrategy.prototype.updatePath = function() {
    var gPath = mapUtil.pathToLatLng(this.object_.get('path'));

    this.getView().setPath(gPath);
  };


  /**
   * Update the view's stroke weight
   * to match the MapObject
   * @method updateViewStyle
   */
  PolylineStrategy.prototype.updateViewStyle = function() {
    this.getView().setOptions({
      strokeColor: this.object_.get('strokeColor'),
      strokeWeight: this.object_.get('strokeWeight'),
      strokeOpacity: this.object_.get('strokeOpacity')
    });
  };


  /**
   * Bind events to the map view.
   *
   * @private
   * @method bindViewEvents_
   */
  PolylineStrategy.prototype.bindViewEvents_ = function() {
    this.googleEvents_.listenTo(this.getView(), {
      // Proxy click event to MapObject
      click: function(evt) {
        var latLon = mapUtil.latLngToArray(evt.latLng);
        this.object_.trigger('click', latLon, this);
      }
    }, this);
  };


  return PolylineStrategy;
});
