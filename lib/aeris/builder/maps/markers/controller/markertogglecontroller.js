define([
  'aeris/util',
  'mapbuilder/core/controller/mapobjecttogglecontroller',
  'mapbuilder/markers/controller/filtertogglecontroller',
  'vendor/marionette'
], function(_, MapObjectToggleController, FilterToggleController, Marionette) {
  /**
   *
   * @class aeris.builder.maps.marker.controller.MarkerToggleController
   * @extends aeris.builder.maps.core.controller.MapObjectToggleController
   *
   * @constructor
   * @override
   */
  var MarkerToggleController = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      regions: {
        filters: 'aeris-markerFilterSelect'
      }
    });

    this.filterSelectController_ = new Marionette.CollectionView({
      itemView: FilterToggleController
    });

    /*this.filterSelectController_ = new FilterSelectController({
      collection: this.model.get('filters')
    });*/

    MapObjectToggleController.call(this, options);
  };
  _.inherits(MarkerToggleController, MapObjectToggleController);


  return MarkerToggleController;
});
