define([
  'aeris/util',
  'aeris/maps/strategy/utils',
  'aeris/maps/strategy/abstractstrategy',
  'googlemaps!'
], function(_, mapUtil, AbstractStrategy, gmaps) {
  /**
   * Strategy for rendering markers.
   *
   * @class Marker
   * @namespace aeris.maps.gmaps.markers
   * @extends aeris.maps.AbstractStrategy
   *
   * @constructor
   * @param {aeris.maps.markers.Marker} marker
   *
   * @param {Object=} opt_options
   * @param {google.maps=} opt_options.googlemaps
   */
  var MarkerStrategy = function(marker, opt_options) {
    var options = _.defaults(opt_options || {}, {
      googlemaps: gmaps
    });

    /**
     * @property gmaps_
     * @private
     * @type {google.maps}
    */
    this.gmaps_ = options.googlemaps;


    /**
     * The marker view-model which
     * this strategy is in charge of rendering.
     *
     * @property marker_
     * @type {aeris.maps.markers.Marker}
     * @private
     */
    this.marker_ = marker;

    AbstractStrategy.call(this, this.marker_);

    this.proxyViewEvents_();

    this.listenTo(this.marker_, {
      'change:position': this.updatePosition_,
      'change:title': this.updateTitle_,
      'change:url change:offsetX change:offsetY': this.updateIcon_,
      'change:selectedUrl change:selectedOffsetX change:selectedOffsetY': this.updateIcon_,
      'change:selected': this.updateIcon_,
      'change:clickable': this.updateClickable_,
      'change:draggable': this.updateDraggable_
    });
  };
  _.inherits(MarkerStrategy, AbstractStrategy);


  /**
   * @method createView_
   */
  MarkerStrategy.prototype.createView_ = function() {
    return new this.gmaps_.Marker(this.getViewOptions_());
  };


  /**
   * @method setMap
   */
  MarkerStrategy.prototype.setMap = function(aerisMap) {
    AbstractStrategy.prototype.setMap.apply(this, arguments);

    this.getView().setMap(this.mapView_);
  };


  /**
   * @method beforeRemove_
   */
  MarkerStrategy.prototype.beforeRemove_ = function() {
    this.getView().setMap(null);
  };


  /**
   * @return {Object} Options for creating the {google.maps.Maker} view.
   * @method getViewOptions_
   */
  MarkerStrategy.prototype.getViewOptions_ = function() {
    return {
      position: mapUtil.arrayToLatLng(this.marker_.get('position')),
      icon: this.createIcon_(),
      flat: true,
      clickable: this.marker_.get('clickable'),
      draggable: this.marker_.get('draggable'),
      title: this.marker_.get('title')
    };
  };


  MarkerStrategy.prototype.createIcon_ = function() {
    return {
      url: this.marker_.isSelected() ?
        this.marker_.get('selectedUrl') : this.marker_.get('url'),
      anchor: this.createAnchorPoint_()
    };
  };


  /**
   * @private
   * @method createAnchorPoint_
   */
  MarkerStrategy.prototype.createAnchorPoint_ = function() {
    var offsetX = this.marker_.isSelected() ?
      this.marker_.get('selectedOffsetX') : this.marker_.get('offsetX');
    var offsetY = this.marker_.isSelected() ?
      this.marker_.get('selectedOffsetY') : this.marker_.get('offsetY');

    return new this.gmaps_.Point(offsetX, offsetY);
  };


  /**
   * Trigger google map events
   * on the marker object.
   *
   * @private
   * @method proxyViewEvents_
   */
  MarkerStrategy.prototype.proxyViewEvents_ = function() {
    this.googleEvents_.listenTo(this.getView(), {
      click: function(evt) {
        var latLon = mapUtil.latLngToArray(evt.latLng);
        this.marker_.trigger('click', latLon, this.marker_);
      },
      dragend: function(evt) {
        var latLon = mapUtil.latLngToArray(evt.latLng);
        this.marker_.trigger('dragend', latLon, this.marker_);

        // Update marker object position attribute
        this.marker_.setPosition(latLon);
      }
    }, this);
  };


  /**
   * @private
   * @method updatePosition_
   */
  MarkerStrategy.prototype.updatePosition_ = function() {
    var latLng = mapUtil.arrayToLatLng(this.marker_.get('position'));
    this.getView().setPosition(latLng);
  };


  /**
   * @private
   * @method updateTitle_
   */
  MarkerStrategy.prototype.updateTitle_ = function() {
    this.getView().setTitle(this.marker_.get('title'));
  };


  /**
   * @method updateIcon_
   * @private
   */
  MarkerStrategy.prototype.updateIcon_ = function() {
    var icon = this.createIcon_();
    this.getView().setIcon(icon);
  };


  /**
   * @method updateClickable_
   * @private
   */
  MarkerStrategy.prototype.updateClickable_ = function() {
    this.getView().setClickable(this.marker_.get('clickable'));
  };


  /**
   * @method updateDraggable_
   * @private
   */
  MarkerStrategy.prototype.updateDraggable_ = function() {
    this.getView().setDraggable(this.marker_.get('draggable'));
  };


  return MarkerStrategy;
});
/**
 * @for aeris.maps.markers.Marker
 */
/**
 * @event click
 * @param {aeris.maps.LatLon} latLon
 * @param {aeris.maps.markers.Marker} marker
 */
/**
 * @event dragend
 * @param {aeris.maps.LatLon} latLon
 * @param {aeris.maps.markers.Marker} marker
 */
