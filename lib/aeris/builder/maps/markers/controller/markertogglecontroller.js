define([
  'aeris/util',
  'application/form/controller/togglecontroller',
  'application/form/controller/togglecollectioncontroller',
  'hbs!mapbuilder/markers/view/markercontrolslayout.html'
], function(_, ToggleController, ToggleCollectionController, controlsView) {
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
      },
      regionControllers: {
        filters: new ToggleCollectionController({
          collection: options.model.get('filters')
        })
      }
    });

    ToggleController.call(this, options);
  };
  _.inherits(MarkerToggleController, ToggleController);


  return MarkerToggleController;
});
