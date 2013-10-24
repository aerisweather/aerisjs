define([
  'aeris/util',
  'application/form/controller/radiocontroller'
], function(_, RadioController) {
  /**
   *
   * @class aeris.builder.routes.routebuilder.controller.TravelModeController
   * @extends aeris.application.form.controller.RadioController
   *
   * @constructor
   * @override
   *
   * @param {aeris.maps.gmaps.route.RouteBuilder} options.routeBuilder Required param.
   */
  var TravelModeController = function(options) {
    RadioController.apply(this, arguments);


    /**
     * @type {aeris.maps.gmaps.route.RouteBuilder}
     * @private
     */
    this.routeBuilder_ = options.routeBuilder;

    this.updateRouteBuilder_();

    // Listen to model
    this.listenTo(this.collection, {
      'select': this.updateRouteBuilder_
    });
  };
  _.inherits(TravelModeController, RadioController);


  TravelModeController.prototype.updateRouteBuilder_ = function() {
    this.routeBuilder_.travelMode = this.collection.getSelected().get('value');
  };


  return TravelModeController;
});
