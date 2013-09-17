define([
  'aeris/util',
  'base/markercollection',
  'aeris/promise',
  'aeris/events'
], function(_) {

  /**
   * @fileoverview Abstraction for a MarkerCollection that is associated with an API endpoint.
   */


  _.provide('aeris.maps.markercollections.APIEndpoint');


  /**
   * Create an abstract APIEndpoint.
   *
   * @abstract
   * @extends {aeris.maps.MarkerCollection}
   * @extends {aeris.Events}
   * @constructor
   * @class aeris.maps.markercollections.APIEndpoint
   */
  aeris.maps.markercollections.APIEndpoint = function() {
    aeris.maps.MarkerCollection.call(this);
    aeris.Events.call(this);


    /**
     * @type {aeris.Promise} Promise to initially fetch markers from the API
     *     endpoint.
     */
    this.initialized = new aeris.Promise();


    // When markers are finally fetched resolve the initialized promise.
    this.on('fetch', function() {
      this.initialized.resolve();
    }, this);

  };
  _.inherits(aeris.maps.markercollections.APIEndpoint,
                 aeris.maps.MarkerCollection);
  _.extend(aeris.maps.markercollections.APIEndpoint.prototype,
               aeris.Events.prototype);


  /**
   * @override
   */
  aeris.maps.markercollections.APIEndpoint.prototype.setMap =
      function(aerisMap) {
    aeris.maps.MarkerCollection.prototype.setMap.call(this, aerisMap);

    // Refresh the markers on the map when new markers are fetched.
    this.on('fetch', this.redraw_(this.markers_), this);

    // Fetch marker data when map bounds change
    this.getMap().options.on('change:bounds', this.fetch, this);

  };


  /**
   * @override
   */
  aeris.maps.markercollections.APIEndpoint.prototype.clear =
      function() {
    aeris.maps.MarkerCollection.prototype.clear.apply(this, arguments);

    // Stop listening to new markers being fetched
    this.off('fetch', null, this);

    // Stop listening to map bounds change
    this.getMap().options.off('change:bounds', this.fetch, this);

  };


  /**
   * Return a function that redraws the markers in the collection.
   *
   * @param {Array.<aeris.maps.Marker>} markers Markers to clear from the map.
   * @private
   */
  aeris.maps.markercollections.APIEndpoint.prototype.redraw_ = function(markers) {
    var self = this;
    var fn = function() {
      var map = self.getMap();
      self.clear(markers);
      self.setMap(map);
    };
    return fn;
  };


  /**
   * Fetch markers from the API endpoint.
   *
   * @fires aeris.maps.markercollections.APIEndpoint#fetch
   * @param {boolean} refresh Make a new request to the API for markers.
   *     Defaults to true.
   * @return {aeris.Promise} A promise to fetch and resolve with Markers.
   */
  aeris.maps.markercollections.APIEndpoint.prototype.fetch = function(refresh) {
    refresh = (typeof refresh == 'undefined') ? true : refresh;
    var promise = new aeris.Promise();

    if (refresh) {
      this.fetchMarkerData().
          done(function(data) {
            this.markers_ = this.parseMarkerData(data);
            promise.resolve(this.markers_);
            this.trigger('fetch', this.markers_);
          }, this).
          fail(function() {
            promise.reject();
          }, this);
    } else {
      promise.resolve(this.markers_);
      this.trigger('fetch', this.markers_);
    }


    return promise;
  };


  /**
   * Fetch marker data from the API endpoint.
   *
   * @return {aeris.Promise} A promise to fetch raw marker data from the API.
   *     endpoint. Resolve with the raw marker data.
   * @protected
   */
  aeris.maps.markercollections.APIEndpoint.prototype.fetchMarkerData =
      _.abstractMethod;


  /**
   * Parse the marker data into an array of Marker objects.
   *
   * @param {Object} data Response data from the API endpoint.
   * @return {Array.<aeris.maps.Marker>}
   * @protected
   */
  aeris.maps.markercollections.APIEndpoint.prototype.parseMarkerData =
      _.abstractMethod;


  /**
   * Event triggered when the markers have been fetched.
   *
   * @event aeris.maps.markercollections.APIEndpoint#fetch
   * @type {Array.<aeris.maps.Marker>}
   */


  return aeris.maps.markercollections.APIEndpoint;

});
