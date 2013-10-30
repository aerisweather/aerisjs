define([
  'aeris/util',
  'mapbuilder/core/collection/mapobjecttogglecollection',
  'mapbuilder/markers/model/markertoggle'
], function(_, MapObjectToggleCollection, MarkerToggle) {
  /**
   *
   * @class aeris.builder.maps.markers.collection.MarkerToggleCollection
   * @extends aeris.builder.maps.core.collection.MapObjectToggleCollection
   *
   * @constructor
   * @override
   */
  var MarkerToggleCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: MarkerToggle
    });

    // Provide any available MapObj filters
    this.stateItems_.each(this.updateToggleFilter_. this);

    this.listenTo(this.stateItems_, {
      // Provide MapObj filters to our
      // Toggle model, whenver a MapObj
      // becomes available in the state
      'add': this.updateToggleFilter_
    });

    // Update state filters
    // when toggle filters change
    this.listenTo(this, {
      'select:filter': function(filterToggle) {
        this.stateItems_.removeFilter(filterToggle.id);
      },
      'deselect:filter': function(filterToggle) {
        this.stateItems_.addFilter(filterToggle.id);
      }
    });

    // Update toggle filters
    // when state filters change
    this.listenTo(this.stateItems_, {
      'change:filters': this.updateToggleFilter_
    });

    MapObjectToggleCollection.call(this, opt_models, options);
  };
  _.inherits(MarkerToggleCollection, MapObjectToggleCollection);


  /**
   * Update a toggle filter from a mapObjectState model.
   *
   * @param {aeris.builder.maps.core.model.MapObjectState} mapObjectState
   * @private
   */
  MarkerToggleCollection.prototype.updateToggleFilter_ = function(mapObjectState) {
    var markerToggle = this.get(mapObjectState.id);
    var filters = [];

    // Just a little hack to get valid filters.
    var filtersList = new (mapObjectState.getMapObject()).getValidFilters();

    _.each(filtersList, function(filterName) {
      // Check if the filter is in the state.
      var isSelected = this.stateItems_.get('filters').indexOf(filterName);

      filters.push({
        value: filterName,
        selected: isSelected
      });
    }, this);

    markerToggle.get('filters').set(filters);
  };


  return MarkerToggleCollection;
});
