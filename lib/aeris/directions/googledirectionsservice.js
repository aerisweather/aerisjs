/**
 * @fileoverview Defines the GoogleDirectionsService class.
 */
define([
  'aeris/util',
  'gmaps/utils',
  'directions/results/directionsresultsstatus',
  'directions/promise/promisetofetchgoogledirections'
], function(_, mapUtils, DirectionsResultsStatus, PromiseToFetchGoogleDirections) {


  /**
   * A wrapper around the google directions service.
   *
   * @class aeris.directions.GoogleDirectionsService
   * @implements aeris.directions.DirectionsServiceInterface
   *
   * @constructor
   *
   * @param {Object=} opt_options
   * @param {google.maps.DirectionsService=} opt_options.directionsServiceApi
   */
  var GoogleDirectionsService = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      PromiseToFetchDirections: PromiseToFetchGoogleDirections
    });

    /**
     * @type {google.maps.DirectionsService}
     * @private
     */
    this.directionsServiceApi_ = options.directionsServiceApi || new google.maps.DirectionsService();


    /**
     * Constructor for {aeris.directions.promise.this.PromiseToFetchDirections_}
     * object.
     *
     * @type {Function}
     * @private
     * @default aeris.directions.promise.this.PromiseToFetchDirections_
     */
    this.PromiseToFetchDirections_ = options.PromiseToFetchDirections;
  };


  /** 
   * @override
   *
   * @param {Array.<number>} origin
   * @param {Array.<number>} destination
   * 
   * @param {Object=} opt_options
   * @param {string=} opt_options.travelMode Defaults to 'WALKING'.
   */
  GoogleDirectionsService.prototype.fetchPath = function(origin, destination, opt_options) {
    var options = _.defaults(opt_options || {}, {
      travelMode: 'WALKING'
    });
    var promise = new this.PromiseToFetchDirections_();
    var requestObject = this.createRequestObject_(origin, destination, options.travelMode);

    this.requestDirections_(requestObject, function(response, status) {
      promise.settleUsingResponse(response, status);
    });

    return promise;
  };


  /**
   * @param {Array.<number>} origin
   * @param {Array.<number>} destination
   * @param {string} travelMode
   * @return {google.maps.DirectionsRequest}
   * @private
   */
  GoogleDirectionsService.prototype.createRequestObject_ = function(origin, destination, travelMode) {
    return {
      origin: mapUtils.arrayToLatLng(origin),
      destination: mapUtils.arrayToLatLng(destination),
      travelMode: google.maps.TravelMode[travelMode]
    }
  };


  /**
   * @param {google.maps.DirectionsRequest} requestObj
   * @param {Function} callback
   * @private
   */
  GoogleDirectionsService.prototype.requestDirections_ = function(requestObj, callback) {
    this.directionsServiceApi_.route(requestObj, _.bind(callback, this));
  };



  return _.expose(GoogleDirectionsService, 'aeris.directions.GoogleDirectionsService');
});

