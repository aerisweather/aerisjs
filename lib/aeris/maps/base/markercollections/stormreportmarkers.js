define([
  'aeris/util', 'aeris/aerisapi', 'base/markercollections/aerisendpoint',
  'base/markers/stormreporticon'
], function(_) {

  /**
   * @fileoverview Defines the {aeris.maps.markerCollections.StormReportMarkers}
   *               class.
   */

  _.provide('aeris.maps.markerCollections.StormReportMarkers');


  /**
   * A collection of markers associated with storm report data.
   * Data provided by the Aeris API `stormreports` endpoint
   *
   * @param {Object} opt_options Options to pass to the
   *     {aeris.maps.markers.Icon} object.
   * @extends aeris.maps.markercollections.AerisEndpoint
   * @constructor
   * @class aeris.maps.markercollections.StormReportMarkers
   */
  aeris.maps.markerCollections.StormReportMarkers = function(opt_options) {

    aeris.maps.markercollections.AerisEndpoint.apply(this, arguments);


    /**
     * Number of hours in the past to get storm reports for.
     *
     * @type {number}
     * @private
     */
    this.hours_ = 4;


    /**
     * The types of markers to display.
     *
     * @type {Array.<string>}
     * @private
     */
    this.types_ = [
      'tornado',
      'highwind',
      'hail',
      'flood',
      'rain',
      'lightning',
      'highsurf',
      'dust',
      'avalanche',
      'wildfire',
      'snow'
    ];


    /**
     * @override
     */
    this.endpoint_ = 'stormreports';
  };

  // Extend from MarkerCollection
  _.inherits(
    aeris.maps.markerCollections.StormReportMarkers,
    aeris.maps.markercollections.AerisEndpoint
  );


  /**
   * @override
   */
  aeris.maps.markerCollections.StormReportMarkers.prototype.getParams_ = function() {
    return {
      limit: 250,
      from: '-' + this.hours_ + 'hours',
      to: 'now'
    };
  };


  /**
   * @override
   */
  aeris.maps.markerCollections.StormReportMarkers.prototype.generateMarker_ =
      function(point, options) {
    var latLon = [point.loc.lat, point.loc.long];
    var code = point.report.code;
    var marker = new aeris.maps.markers.StormReportIcon(latLon, code,
                                                      options);
    return marker;
  };


  /**
   * Set the number of hours in the past to get storm reports for.
   *
   * @param {number} hours The number of hours.
   */
  aeris.maps.markerCollections.StormReportMarkers.prototype.setHours = function(hours) {
    this.hours_ = hours;
    this.fetch();
  };


  /**
   * Set the type of storms to display.
   *
   * @param {Array.<string>} types An array of the types of storms.
   */
  aeris.maps.markerCollections.StormReportMarkers.prototype.setTypes = function(types) {
    this.types_ = types;
    this.fetch(false);
  };


  /**
   * @override
   */
  aeris.maps.markerCollections.StormReportMarkers.prototype.filterMarker = function(marker) {
    return this.types_.indexOf(marker.getType()) !== -1;
  };


  return aeris.maps.markerCollections.StormReportMarkers;

});
