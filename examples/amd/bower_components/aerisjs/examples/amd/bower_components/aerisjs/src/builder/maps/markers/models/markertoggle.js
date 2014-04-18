define([
  'aeris/util',
  'aeris/builder/maps/core/models/mapobjecttoggle',
  'aeris/application/forms/collections/togglecollection'
], function(_, MapObjectToggle, ToggleCollection) {
  /**
   * The state of a {aeris.maps.markercollections.PointDataMarkers} in the application
   *
   * @class MarkerToggle
   * @namespace aeris.builder.maps.markers.models
   * @extends aeris.builder.maps.core.models.MapObjectToggle
   *
   * @constructor
   * @override
   */
  var MarkerToggle = function(opt_attrs, opt_options) {
    /**
     * Filters being applied to the marker.
     * Filters will always use the {aeris.api.Operator.OR} operator.
     *
     * Note: directly modifying the filters array
     * will NOT trigger change events. Please use
     * addFilter / removeFilter
     *
     * @attribute filters
     * @type {aeris.application.forms.collections.ToggleCollection}
     */
    var attrs = _.defaults(opt_attrs || {}, {
      filters: []
    });
    var options = _.defaults(opt_options || {}, {
      namespace: 'aeris.maps.markercollections'
    });

    // Set filters attr from an injected ToggleCollection
    // or from a raw array.
    if (!(attrs.filters instanceof ToggleCollection)) {
      attrs.filters = new ToggleCollection(attrs.filters, {
        idAttribute: 'type'
      });
    }

    MapObjectToggle.call(this, attrs, options);
  };
  _.inherits(MarkerToggle, MapObjectToggle);


  /**
   * @method normalize_
   */
  MarkerToggle.prototype.normalize_ = function(attrs) {
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
   * @method toJSON
   */
  MarkerToggle.prototype.toJSON = function() {
    var json = MapObjectToggle.prototype.toJSON.apply(this, arguments);

    // JSONify child collections
    json.filters = this.get('filters').toJSON();

    return json;
  };

  return MarkerToggle;
});
