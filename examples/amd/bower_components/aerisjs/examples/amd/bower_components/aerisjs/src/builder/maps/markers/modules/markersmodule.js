define([
  'aeris/util',
  'aeris/builder/maps/core/modules/mapobjectmodule'
], function(_, MapObjectModule) {
  /**
   * Application module for point data markers.
   *
   * @class MarkersModule
   * @namespace aeris.builder.maps.markers
   * @extends aeris.builder.core.modules.MapObjectModule
   *
   * @constructor
   * @override
   *
   * @param {Function} options.MarkerInfoController ({Backbone.View} constructor) Required.
   * @param {aeris.Events} options.eventHub Required.
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

    /**
     * Application-wide event hub
     *
     * @type {aeris.Events}
     * @property eventHub_
     */
    this.eventHub_ = options.eventHub;


    /**
     * Controller for rendering
     * marker data details.
     *
     * @type {Function} {Backbone.View} constructor.
     * @property MarkerInfoController_
     */
    this.MarkerInfoController_ = options.MarkerInfoController;


    MapObjectModule.call(this, options);
  };
  _.inherits(MarkersModule, MapObjectModule);


  /**
   * @method processMapObjectOption_
   */
  MarkersModule.prototype.processMapObjectOption_ = function(mapObjectOption) {
    // Get the parent processed object
    var mapObjectState = MapObjectModule.prototype.processMapObjectOption_.call(this, mapObjectOption);

    // Create a `filters` ToggleCollection,
    // from our validFilters lookup.
    var validFilters = this.validFilters[mapObjectOption.type] || [];
    var filters = _.map(validFilters, function(filterName) {
      return {
        type: filterName,

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


  /**
   * Render a marker info view using
   * the supplied marker data.
   *
   * @param {aeris.Model} marker
   * @method renderMarkerInfo
   */
  MarkersModule.prototype.renderMarkerInfo = function(marker) {
    var markerInfoView = new this.MarkerInfoController_({
      model: marker
    });

    // Tell the world about our info view.
    // We have nowhere to put it, but someone
    // else might (say, an InfoPanel module).
    this.eventHub_.trigger('info:view', markerInfoView);
  };


  return MarkersModule;
});
