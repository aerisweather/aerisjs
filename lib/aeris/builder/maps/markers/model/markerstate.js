define([
  'aeris/util',
  'mapbuilder/core/model/mapobjecttoggle',
  'application/form/collection/togglecollection'
], function(_, MapObjectToggle, ToggleCollection) {
  /**
   * The state of a {aeris.maps.markercollections.PointDataMarkerCollection} in the application
   *
   * @class aeris.builder.maps.markers.model.MarkerState
   * @extends aeris.builder.maps.core.model.MapObjectToggle
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
     * @type {aeris.application.form.collection.ToggleCollection}
     */
    var attrs = opt_attrs || {};

    // Set filters attr from an injected ToggleCollection
    // or from a raw array.
    if (!(attrs.filters instanceof ToggleCollection)) {
      attrs.filters = new ToggleCollection(attrs.filters);
    }

    MapObjectToggle.call(this, attrs, opt_options);
  };
  _.inherits(MarkerState, MapObjectToggle);


  /**
   * @override
   */
  MarkerState.prototype.normalize_ = function(attrs) {
    // Set raw array on filter ToggleCollection
    if (_.isArray(attrs.filters)) {
      this.get('filters').set(attrs.filters);

      // Remove the filters attribute
      // -- we've already set it.
      delete attrs.filters;
    }

    return attrs;
  };


  /**
   * @override
   */
  MarkerState.prototype.toJSON = function() {
    var json = MapObjectToggle.prototype.toJSON.apply(this, arguments);

    // JSONify child collections
    json.filters = this.get('filters').toJSON();

    return json;
  };

  return MarkerState;
});
