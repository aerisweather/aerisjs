define([
  'aeris/util',
  'aeris/maps/strategy/abstractstrategy',
  'googlemaps!'
], function(_, BaseStrategy, gmaps) {
  /**
   * @class AerisPolygonsStrategy
   * @namespace aeris.maps.gmaps.layers
   * @extends aeris.maps.gmaps.AbstractStrategy
   * @constructor
   */
  var AerisPolygonsStrategy = function() {
    BaseStrategy.apply(this, arguments);

    this.listenTo(this.object_, {
      'change': this.updateStyles_
    });
  };

  _.inherits(AerisPolygonsStrategy, BaseStrategy);


  /**
   * @override
   * @return {Object.<number,google.maps.Polygon>}
   *        As { [groupNumber]: [gPolygon view], ...}.
   * @method createView_
   */
  AerisPolygonsStrategy.prototype.createView_ = function() {
    var polygons = {};

    this.object_.fetch().done(function(data) {
      _.each(data.groups, function(group) {
        var polygonOptions;
        var polygonView;

        polygonOptions = _.extend({
          paths: this.parseGroupPaths_(group),
          clickable: false,
          groupValue: group.value
        }, this.object_.get('styles')[group.value]);

        polygonView = new gmaps.Polygon(polygonOptions);
        polygons[group.value] = polygonView;

        // Add all the polygons to the map,
        // if one has been set by now
        if (this.mapView_) {
          this.refreshMap_();
        }
      }, this);
    }, this);

    return polygons;
  };


  /**
   * Converts a 'group' object
   * from the Aeris Polygons API
   * into an array of polylines.
   *
   * @param {Object} group
   * @return {Array.<Array.google.maps.LatLng>}
   * @private
   * @method parseGroupPaths_
   */
  AerisPolygonsStrategy.prototype.parseGroupPaths_ = function(group) {
    var polylines = [];

    // Add all polylines from the group
    // to the array
    _.each(group.polygons, function(polygon) {
      var line = gmaps.geometry.encoding.decodePath(
        polygon.points
      );
      polylines.push(line);
    }, this);

    return polylines;
  };


  /**
   * Ensures that all polygons
   * are set to the maps.
   *
   * @private
   * @method refreshMap_
   */
  AerisPolygonsStrategy.prototype.refreshMap_ = function() {
    _.each(this.getView(), function(polygonView) {
      polygonView.setMap(this.mapView_);
    }, this);
  };


  /**
   * @return {string} The url endpoint for grabbing Aeris polygon data.
   * @method getUrl_
   */
  AerisPolygonsStrategy.prototype.getUrl_ = function() {
    return 'http://gis.hamweather.net/json/' +
      this.object_.get('aerisPolygonType') + '.json';
  };


  /**
   * @method setMap
   */
  AerisPolygonsStrategy.prototype.setMap = function(aerisMap) {
    BaseStrategy.prototype.setMap.apply(this, arguments);

    this.refreshMap_();
  };


  AerisPolygonsStrategy.prototype.afterRemove_ = function() {
    this.refreshMap_();
  };


  AerisPolygonsStrategy.prototype.setOpacity_ = function(opacity) {
    opacity = parseFloat(this.object_.get('opacity'));
  };


  /**
   * Update view styles to match
   * layer view-data.
   *
   * @private
   * @method updateStyles_
   */
  AerisPolygonsStrategy.prototype.updateStyles_ = function() {
    var layerOpacity = this.object_.get('opacity');

    _.each(this.getView(), function(polygon, groupNumber) {
      var styles = this.object_.get('styles')[groupNumber];


      var options = _.extend({}, styles, {
        fillColor: styles.fillColor,
        strokeColor: styles.strokeColor,
        // Set each polygon opacity as relative to
        // the overall layer opacity
        fillOpacity: styles.fillOpacity * layerOpacity,
        strokeOpacity: styles.strokeOpacity * layerOpacity
      });

      polygon.setOptions(options);
    }, this);
  };

  return AerisPolygonsStrategy;
});
