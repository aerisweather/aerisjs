define([
  'aeris/util',
  'mapbuilder/core/model/mapobjectstate'
], function(_, MapObjectState) {
  /**
   * The state of a {aeris.maps.markercollections.PointDataMarkerCollection} in the application
   *
   * @class aeris.builder.maps.markers.model.MarkerState
   * @extends aeris.builder.maps.core.model.MapObjectState
   *
   * @constructor
   * @override
   */ 
  var MarkerState = function(opt_attrs, opt_options) {
    /**
     * Filters being applied to the marker.
     * Filters will always use the 'OR' operator.
     *
     * Note: directly modifying the filters array
     * will NOT trigger change events. Please use
     * addFilter / removeFilter
     *
     * @attribute filters
     * @type {Array.<string>}
     */
    var attrs = _.defaults(opt_attrs || {}, {
      filters: []
    });

    MapObjectState.call(this, attrs, opt_options);
  };
  _.inherits(MarkerState, MapObjectState);


  /**
   * Remove a filter.
   *
   * @param {string} filterName
   */
  MarkerState.prototype.removeFilter = function(filterName) {
    var index = this.get('filters').indexOf(filterName);

    // Filter does not exist
    if (index === -1) { return; }

    this.get('filters').splice(index, 1);

    this.triggerFilterChangeEvent_();
  };


  /**
   * Add a filter.
   *
   * @param {string} filterName
   */
  MarkerState.prototype.addFilter = function(filterName) {
    // Filter already exists.
    if (this.get('filters').indexOf(filterName) !== -1) {
      return;
    }

    this.get('filters').push(filterName);

    this.triggerFilterChangeEvent_();
  };


  /**
   * Trigger a 'change' and 'change:filters' event.
   *
   * @private
   */
  MarkerState.prototype.triggerFilterChangeEvent_ = function() {
    this.trigger('change', this);
    this.trigger('change:filters', this, this.get('filters'));
  };


  return MarkerState;
});
