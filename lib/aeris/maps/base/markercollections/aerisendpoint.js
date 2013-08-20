define([
  'aeris/util',
  'aeris/aerisapi',
  'aeris/errors/apiresponseerror',
  'base/markercollections/apiendpoint'
], function(_, AerisAPI, APIResponseError) {

  /**
   * @fileoverview Provide an abstraction for gathering Aeris Endpoint data and
   *               forming it into a MarkerCollection.
   */

  _.provide('aeris.maps.markercollections.AerisEndpoint');


  /**
   * Create an AerisEndpoint.
   *
   * @abstract
   * @param {Object} opt_markerOptions Options to pass on to {aeris.maps.Marker}.
   * @extends {aeris.maps.markercollections.APIEndpoint}
   * @constructor
   */
  aeris.maps.markercollections.AerisEndpoint = function(opt_markerOptions) {

    // Call parent class constructor
    aeris.maps.markercollections.APIEndpoint.call(this);


    /**
     * Options to use when instantiating each {aeris.maps.Marker}
     *
     * @type {Object}
     * @protected
     */
    this.markerOptions_ = opt_markerOptions || {};


    /**
     * The AerisAPI endpoint associated
     * with this marker collection
     *
     * @type {string}
     * @protected
     */
    this.endpoint_ = null;


    /**
     * The AerisAPI action associated
     * with this marker collection
     *
     * @type {string}
     * @protected
     */
    this.action_ = 'within';

  };

  _.inherits(
    aeris.maps.markercollections.AerisEndpoint,
    aeris.maps.markercollections.APIEndpoint
  );


  /**
   * @override
   * @param {boolean} filter Filter the markers. Defaults to true.
   */
  aeris.maps.markercollections.AerisEndpoint.prototype.getMarkers =
      function(filter) {
    filter = (typeof filter == 'undefined') ? true : filter;

    var markers =
        aeris.maps.markercollections.APIEndpoint.prototype.getMarkers.call(this);

    if (filter)
      markers = _.filter(markers, this.filterMarker, this);

    return markers;
  };


  /**
   * @override
   */
  aeris.maps.markercollections.AerisEndpoint.prototype.fetchMarkerData =
      function() {
    var params = {
      limit: 100,
      p: AerisAPI.serializeBounds(this.getBounds())
    };

    if (this.getParams_) {
      _.extend(params, this.getParams_());
    }

    var data = AerisAPI.getInstance().
        fetch(this.endpoint_, this.action_, params);
    return data;
  };


  /**
   * @override
   */
  aeris.maps.markercollections.AerisEndpoint.prototype.parseMarkerData =
      function(data) {
    var markers = [];

    // Enforce data format
    if (!data.response) {
      throw new APIResponseError('Unable to process marker data: unexpected data format');
    }

    _.each(data.response, function(point) {
      var marker = this.generateMarker_(point, this.markerOptions_);

      marker.on('click', this.getOnClick_(marker, point));

      markers.push(marker);
    }, this);

    return markers;
  };


  /**
   * Generate a new marker for the collection using the point information and
   * options.
   *
   * @protected
   *
   * @param {Object} point Point data from the AerisAPI.
   * @param {Object} options Additional marker options.
   * @return {aeris.maps.Marker}
   */
  aeris.maps.markercollections.AerisEndpoint.prototype.generateMarker_ =
      _.abstractMethod;


  /**
   * Returns the handler method for a marker's `click` event
   *
   * @param {aeris.maps.markers.Icon} marker Bound marker.
   * @param {Object} data Data associated with marker.
   * @return {Function} onClick Handler.
   * @private
   */
  aeris.maps.markercollections.AerisEndpoint.prototype.getOnClick_ =
      function(marker, data) {
    var self = this;
    return function() {
      self.trigger('marker:click', marker, data);
    }
  };


  /**
   * Get the map bounds.
   *
   * @param {Array.<Array>} bounds
   */
  aeris.maps.markercollections.AerisEndpoint.prototype.getBounds =
      function(bounds) {
    return this.getMap().options.getBounds();
  };

  /**
   * Filter a marker to determine if it should be displayed on the map.
   *
   * @param {aeris.maps.Marker} marker The marker to filter.
   * @return {boolean} true if the marker should be displayed.
   */
  aeris.maps.markercollections.AerisEndpoint.prototype.filterMarker =
      function(marker) {
    return true;
  };


  return aeris.maps.MarkerCollection;
});
