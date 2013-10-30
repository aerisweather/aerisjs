define([
  'aeris/util',
  'application/form/controller/togglecontroller',
  'mapbuilder/markers/controller/filtertogglescontroller',
  'hbs!mapbuilder/markers/view/markercontrolslayout.html'
], function(_, ToggleController, FilterTogglesController, controlsView) {
  /**
   * Controls a toggle (~checkbox) view for a marker.
   *
   * @class aeris.builder.maps.marker.controller.MarkerToggleController
   * @extends aeris.application.form.controller.ToggleController
   *
   * @constructor
   * @override
   *
   * @param {aeris.builder.maps.core.model.MapObjectState} options.model Required.
   */
  var MarkerToggleController = function(options) {
    options = _.defaults(options || {}, {
      template: controlsView,
      regions: {
        filters: '.aeris-markerFilterSelect'
      }
    });

    ToggleController.call(this, options);

    this.filterToggleController_ = new FilterTogglesController({
      collection: this.model.get('filters')
    });

    // Show filters only when
    // marker is selected
    this.listenTo(this.model, {
      select: this.showFilterControls_,
      deselect: this.hideFilterControls_
    });
    this.listenTo(this, {
      render: function() {
        if (this.model.get('selected')) {
          this.showFilterControls_();
        }
        else {
          this.hideFilterControls_();
        }
      }
    });
  };
  _.inherits(MarkerToggleController, ToggleController);


  MarkerToggleController.prototype.showFilterControls_ = function() {
    this.filters.show(this.filterToggleController_);
  };


  MarkerToggleController.prototype.hideFilterControls_ = function() {
    this.filters.close();
  };


  return MarkerToggleController;
});
