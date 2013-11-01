define([
  'aeris/util',
  'mapbuilder/core/module/mapobjectmodule'
], function(_, MapObjectModule) {
  /**
   * Application module for point data markers.
   *
   * @class aeris.builder.maps.markers.MarkersModule
   * @extends aeris.builder.core.module.MapObjectModule
   *
   * @constructor
   * @override
   *
   * @param {Object.<string.Array.<string>>=} options.validFilters
   *        A lookup map to find filters by
   *        marker class name.
   *
   *        eg: {
   *          'StormReportMarkers': ['wind', 'rain', 'snow']
   *        }
   *
   *        Specified filters will be added to the application
   *        state.
   *
   *        If undefined, no filters will be added to the state.
   */
  var MarkersModule = function(options) {

    this.validFilters = options.validFilters || {};

    MapObjectModule.call(this, options);
  };
  _.inherits(MarkersModule, MapObjectModule);


  /**
   * @override
   */
  MarkersModule.prototype.processBuilderOption_ = function(mapObjectOption) {
    // Get the parent processed object
    var mapObjectState = MapObjectModule.prototype.processBuilderOption_.call(this, mapObjectOption);

    // Create a `filters` ToggleCollection,
    // from our validFilters lookup.
    var validFilters = this.validFilters[mapObjectOption.name] || [];
    var filters = _.map(validFilters, function(filterName) {
      return {
        value: filterName,

        // Mark filter as selected if named
        // in the option's 'filters' array.
        selected: _(mapObjectOption.filters).contains(filterName)
      };
    });


    // Add our filters ToggleCollection
    // to the map object state
    return _.extend(mapObjectState, {
      // Create a filters ToggleColl
      filters: filters
    });
  };


  return MarkersModule;
});
