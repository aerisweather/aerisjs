define([
  'aeris/util',
  'mapbuilder/core/controller/mapobjectcontroller'
], function(_, MapObjectController) {
  /**
   * Controls {aeris.maps.markercollections.PointDataMarkerCollection} views.
   *
   * @class aeris.builder.maps.markers.controller.MarkerController
   * @extends aeris.builder.core.conroller.MapObjectController
   *
   * @constructor
   * @override
   */
  var MarkerController = function() {
    MapObjectController.apply(this, arguments);

    // Bind to filters
    this.listenTo(this.model.get('filters'), {
      'add remove change:selected': this.updateFilters_
    });
    this.listenTo(this, {
      render: this.updateFilters_
    });
    this.updateFilters_();
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

    this.view_.getParams().resetFilter(filterNames);
  };


  return MarkerController;
});
