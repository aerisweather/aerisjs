define([
  'aeris/util',
  'mapbuilder/core/module/mapobjectmodule',
  'mapbuilder/markers/config/validmarkerfilters'
], function(_, MapObjectModule, validMarkerFilters) {
  /**
   * Application module for point data markers.
   *
   * @class aeris.builder.maps.markers.MarkersModule
   * @extends aeris.builder.core.module.MapObjectModule
   *
   * @constructor
   * @override
   */
  var MarkersModule = function() {
    MapObjectModule.apply(this, arguments);
  };
  _.inherits(MarkersModule, MapObjectModule);


  /**
   * @override
   */
  MarkersModule.prototype.processBuilderOption_ = function(mapObjectOption) {
    // Convert to toggle object
    var stateObject = MapObjectModule.prototype.processBuilderOption_.call(this, mapObjectOption);
    var validFilters = validMarkerFilters[mapObjectOption.name] || [];

    // Create a `filters` ToggleCollection
    var filters = _.map(validFilters, function(filterName) {
      return {
        value: filterName,

        // Mark filter as selected if named
        // in the option's 'filters' array.
        selected: _(mapObjectOptions.filters).contains(filterName)
      };
    });


    return _.extend(stateObject, {
      // Create a filters ToggleColl
      filters: filters
    });
  };


  return MarkersModule;
});
