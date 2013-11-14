define([
  'aeris/util',
  'mapbuilder/core/controller/mapobjectcontroller'
], function(_, MapObjectController) {
  /**
   * Controls {aeris.maps.markercollections.PointDataMarkerCollection} views.
   *
   * @class aeris.builder.maps.markers.controller.MarkerController
   * @extends aeris.builder.core.controller.MapObjectController
   *
   * @constructor
   * @override
   */
  var MarkerController = function(options) {
    /**
     * Application event hub.
     *
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;


    MapObjectController.call(this, options);

    // Bind to filters
    this.listenTo(this.model.get('filters'), {
      'add remove change:selected': this.updateFilters_,

      // Ensure that marker is selected, if a filter
      // is selected
      'select': _.bind(this.model.select, this.model)
    });
    this.listenTo(this, {
      render: this.updateFilters_
    });


    // Bind to map view events
    this.listenTo(this, {
      render: this.bindMapViewEvents_
    })
  };
  _.inherits(MarkerController, MapObjectController);


  /**
   * Update the api filters on the markers,
   * to match the application state's filters.
   *
   * @private
   */
  MarkerController.prototype.updateFilters_ = function() {
    var activeFilters, filterNames;

    // Can't do nothing if we have no view.
    if (!this.view_) { return; }

    activeFilters = this.model.get('filters').getSelected();
    filterNames = _.map(activeFilters, function(filterModel) {
      return filterModel.id;
    }, this);

    // No filters selected,
    // --> turn off marker
    if (!activeFilters.length) {
      this.model.deselect();
      return;
    }

    this.resetFilter_(filterNames);
  };


  /**
   * Reset filter parameters.
   *
   * @param {Array.<string>} filters
   * @protected
   */
  MarkerController.prototype.resetFilter_ = function(filters) {
    if (!this.view_) { return; }

    this.view_.getParams().resetFilter(filters, { operator: 'OR' });
  };


  /**
   * Bind events to the map view.
   *
   * @private
   */
  MarkerController.prototype.bindMapViewEvents_ = function() {
    this.listenTo(this.view_, {
      click: function(latLon, marker) {
        this.eventHub_.trigger('marker:click', latLon, marker);
      }
    });
  };


  return MarkerController;
});
