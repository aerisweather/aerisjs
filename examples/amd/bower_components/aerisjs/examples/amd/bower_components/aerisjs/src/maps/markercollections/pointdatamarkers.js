define([
  'aeris/util',
  'aeris/maps/markercollections/markercollection'
], function(_, MarkerCollection) {
  /**
   * A collection of {aeris.maps.markers.PointDataMarker} map objects.
   *
   * @class PointDataMarkers
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.markercollections.MarkerCollection
   *
   * @constructor
   * @override
  */
  var PointDataMarkers = function(opt_models, opt_options) {
    MarkerCollection.call(this, opt_models, opt_options);
  };
  _.inherits(PointDataMarkers, MarkerCollection);


  // Dynamically proxy {aeris.api.collections.AerisApiCollection}
  // params-interface methods
  _.each([
    'getParams',
    'setParams',
    'setFrom',
    'setTo',
    'setLimit',
    'setBounds',
    'addFilter',
    'removeFilter',
    'resetFilter',
    'addQuery',
    'removeQuery',
    'resetQuery',
    'getQuery'
  ], function(methodName) {
    PointDataMarkers.prototype[methodName] = function(var_args) {
      return this.data_[methodName].apply(this.data_, arguments);
    };
  });
  /**
   * Return params used to query the Aeris API.
   *
   * @method getParams
   * @return {aeris.api.params.models.Params}
   */
  /**
   * Set params used to query the Aeris API.
   *
   * @method setParams
   * @param {Object} params
   */
  /**
   * Set the `from` parameter for querying the Aeris API.
   *
   * @method setFrom
   * @param {Date} from
   */
  /**
   * Set the `to` parameter for querying the Aeris API.
   *
   * @method setTo
   * @param {Date} to
   */
  /**
   * Set the latLon bounds for querying the Aeris API.
   *
   * @method setBounds
   * @param {aeris.maps.Bounds} bounds
   */
  /**
   * Add a filter to the Aeris API request.
   *
   * @method addFilter
   * @param {string|Array.<string>} filter
   */
  /**
   * Remove a filter from the Aeris API request.
   *
   * @method removeFilter
   * @param {string|Array.<string>} filter
   */
  /**
   * Reset a filter from the Aeris API request.
   *
   * @method resetFilter
   * @param {string|Array.<string>=} opt_filter
   */
  /**
   * Add a query term to Aeris API request.
   *
   * @method addQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>} query
   */
  /**
   * Remove a query from the Aeris API request
   *
   * @method removeQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>|string|Array.<string>} Query model(s), or property (key).
   */
  /**
   * Resets the query for the Aeris API request.
   *
   * @method resetQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>=} opt_replacementQuery
   */
  /**
   * Returns the query for the Aeris API request.
   *
   * @method getQuery
   * @return {aeris.api.params.collections.ChainedQueries}
   */


  return PointDataMarkers;
});
