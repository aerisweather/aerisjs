define([
  'aeris/util',
  'aeris/builder/maps/core/controllers/mapobjecttogglecontroller',
  'aeris/api/params/models/filter',
  'aeris/api/operator'
], function(_, MapObjectToggleController, Filter, Operator) {
  /**
   * Controls {aeris.maps.markercollections.PointDataMarkers} views.
   *
   * @class MarkerController
   * @namespace aeris.builder.maps.markers.controllers
   * @extends aeris.builder.core.controllers.MapObjectToggleController
   *
   * @constructor
   * @override
   *
   * @param {aeris.builder.maps.markers.models.MarkerToggle} options.model Required.
   * @param {aeris.Events} options.eventHub Required.
   */
  var MarkerController = function(options) {
    /**
     * Application event hub.
     *
     * @type {aeris.Events}
     * @protected
     * @property eventHub_
     */
    this.eventHub_ = options.eventHub;


    MapObjectToggleController.call(this, options);

    this.listenTo(this, {
      render: this.updateFilters_
    });


    // Bind to map view events
    this.listenTo(this, {
      render: function() {
        this.bindMapViewEvents_();

        this.listenTo(this.view_, 'map:set', function() {
          this.fetchMarkerData_({
            remove: false
          });
        });
        if (this.view_.hasMap()) {
          this.view_.setBounds(this.view_.getMap().getBounds());
          this.fetchMarkerData_({
            remove: false
          });
        }
      }
    });
  };
  _.inherits(MarkerController, MapObjectToggleController);


  /**
   * Zoom in and center on a marker.
   *
   * @param {aeris.maps.markers.Marker} marker
   * @method zoomToMarker
   */
  MarkerController.prototype.zoomToMarker = function(marker) {
    var mapOptions = this.appState_.get('mapOptions');

    if (mapOptions.get('zoom') < 13) {
      mapOptions.set({
        center: marker.getPosition(),
        zoom: 13
      }, { validate: true });
    }
  };


  /**
   * @method fetchMarkerData_
   * @param {Object=} opt_options fetch options.
   * @private
   */
  MarkerController.prototype.fetchMarkerData_ = function(opt_options) {
    this.view_.fetchData(opt_options).
      fail(function(errRes) {
        throw new Error(errRes.description || 'Unable to fetch waypoint data.');
      });
  };


  /**
   * Update the api filters on the markers,
   * to match the application state's filters.
   *
   * @private
   * @method updateFilters_
   */
  MarkerController.prototype.updateFilters_ = function() {
    var activeFilters, filterNames;

    // Can't do nothing if we have no view.
    if (!this.view_) { return; }

    // If there are no filters defined,
    // leave well enought alone
    if (!this.model.get('filters').length) { return; }

    activeFilters = this.model.get('filters').getSelected();
    filterNames = _.map(activeFilters, function(filterModel) {
      return filterModel.id;
    }, this);

    // No filters selected,
    // --> turn off marker
    if (!activeFilters.length && this.model.get('filters').length) {
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
   * @method resetFilter_
   */
  MarkerController.prototype.resetFilter_ = function(filters) {
    if (!this.view_) { return; }

    this.view_.getParams().resetFilter(filters, { operator: Operator.OR });
  };


  /**
   * Bind events to the map view.
   *
   * @private
   * @method bindMapViewEvents_
   */
  MarkerController.prototype.bindMapViewEvents_ = function() {
    // Bind to filters
    if (this.model.get('filters')) {
      this.listenTo(this.model.get('filters'), {
        'add remove change:selected': this.updateFilters_,

        // Ensure that marker is selected, if a filter
        // is selected
        'select': _.bind(this.model.select, this.model)
      });
    }

    // Trigger 'marker:click' event
    this.listenTo(this.view_, {
      click: this.triggerClickEvent_
    });

    // Sync bounds data param to map bounds
    this.listenTo(this.map_, {
      'change:bounds': function() {
        this.view_.getParams().setBounds(this.map_.get('bounds'));
        this.fetchMarkerData_({
          remove: false
        });
      }
    });
  };


  /**
   * Trigger an event
   * when the marker is clicked.
   *
   * @protected
   * @method triggerClickEvent_
   */
  MarkerController.prototype.triggerClickEvent_ = function(latLon, marker) {
    this.eventHub_.trigger('marker:click', latLon, marker);
  };


  return MarkerController;
});
