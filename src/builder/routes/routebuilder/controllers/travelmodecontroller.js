define([
  'aeris/util',
  'aeris/application/forms/controllers/radiocontroller'
], function(_, RadioController) {
  /**
   *
   * @class TravelModeController
   * @namespace aeris.builder.routes.routebuilder.controllers
   * @extends aeris.application.forms.controllers.RadioController
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
     * @property routeBuilder_
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
