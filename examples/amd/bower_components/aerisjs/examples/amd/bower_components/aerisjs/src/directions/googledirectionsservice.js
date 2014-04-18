define([
  'aeris/util',
  'aeris/maps/strategy/utils',
  'aeris/directions/results/directionsresultsstatus',
  'aeris/directions/promises/promisetofetchgoogledirections',
  'googlemaps!'
], function(_, mapUtils, DirectionsResultsStatus, PromiseToFetchGoogleDirections, gmaps) {


  /**
   * A wrapper around the google directions service.
   *
   * @class GoogleDirectionsService
   * @namespace aeris.directions
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
     * @property directionsServiceApi_
     */
    this.directionsServiceApi_ = options.directionsServiceApi || new gmaps.DirectionsService();


    /**
     * Constructor for {aeris.directions.promises.this.PromiseToFetchDirections_}
     * object.
     *
     * @type {Function}
     * @private
     * @default aeris.directions.promises.this.PromiseToFetchDirections_
     * @property PromiseToFetchDirections_
     */
    this.PromiseToFetchDirections_ = options.PromiseToFetchDirections;
  };


  /**
   * @override
   *
   * @param {aeris.maps.LatLon} origin
   * @param {aeris.maps.LatLon} destination
   *
   * @param {Object=} opt_options
   * @param {string=} opt_options.travelMode Defaults to 'WALKING'.
   * @method fetchPath
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
   * @param {aeris.maps.LatLon} origin
   * @param {aeris.maps.LatLon} destination
   * @param {string} travelMode
   * @return {google.maps.DirectionsRequest}
   * @private
   * @method createRequestObject_
   */
  GoogleDirectionsService.prototype.createRequestObject_ = function(origin, destination, travelMode) {
    return {
      origin: mapUtils.arrayToLatLng(origin),
      destination: mapUtils.arrayToLatLng(destination),
      travelMode: gmaps.TravelMode[travelMode]
    };
  };


  /**
   * @param {google.maps.DirectionsRequest} requestObj
   * @param {Function} callback
   * @private
   * @method requestDirections_
   */
  GoogleDirectionsService.prototype.requestDirections_ = function(requestObj, callback) {
    this.directionsServiceApi_.route(requestObj, _.bind(callback, this));
  };



  return _.expose(GoogleDirectionsService, 'aeris.directions.GoogleDirectionsService');
});

