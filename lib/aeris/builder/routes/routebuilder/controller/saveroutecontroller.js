define([
  'aeris/util',
  'application/controller/itemcontroller'
], function(_, ItemController) {
  /**
   * @class aeris.builder.routes.routebuilder.controller.SaveRouteController
   * @extends aeris.application.controller.ItemController
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   *
   * @param {aeris.maps.gmaps.route.RouteBuilder} options.routeBuilder
   * @param {Function} options.RouteModel Constructor for {aeris.Model}.
   * @param {aeris.Events} options.eventHub
  */
  var SaveRouteController = function(options) {
    /**
     * @type {aeris.maps.gmaps.route.RouteBuilder}
     * @private
     */
    this.routeBuilder_ = options.routeBuilder;

    /**
     * @type {Function} Ctor for {aeris.Model}
     * @private
     */
    this.RouteModel_ = options.RouteModel;

    /**
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;


    ItemController.apply(this, arguments);

    this.declareUI(
      'nameInput',
      'descrInput',
      'saveBtn',
      'closeBtn'
    );

    this.listenToOnce(this, 'render', this.setupUIBindings_);
  };
  _.inherits(SaveRouteController, ItemController);


  /** @private */
  SaveRouteController.prototype.setupUIBindings_ = function() {
    this.bindUIEvent('click', 'saveBtn', this.saveRoute_, this);
    this.bindUIEvent('click', 'closeBtn', function() {
      this.close();
    }, this);
  };


  /** @private */
  SaveRouteController.prototype.saveRoute_ = function() {
    var routeModelData = this.getRouteData_();
    var routeModel = this.createRouteModel_(routeModelData);

    this.validateRouteModel_(routeModel);

    this.publishSavedRoute_(routeModel.toJSON());
  };


  /** @private */
  SaveRouteController.prototype.getRouteData_ = function() {
    var formData = this.serializeFormData_();
    var exportedRoute = this.getExportedRoutePoints_();

    return _.extend({}, formData, {
      route: exportedRoute
    });
  };


  /** @private */
  SaveRouteController.prototype.serializeFormData_ = function() {
    return {
      name: this.ui.nameInput.val(),
      description: this.ui.descrInput.val()
    };
  };


  /** @private */
  SaveRouteController.prototype.getExportedRoutePoints_  = function() {
    return this.routeBuilder_.routeToJSON();
  };


  /** @private */
  SaveRouteController.prototype.createRouteModel_ = function(data) {
    return new this.RouteModel_(data);
  };


  /** @private */
  SaveRouteController.prototype.validateRouteModel_ = function(routeModel) {
    try {
      routeModel.isValid();
    }
    catch (e) {
      if (e.name === 'InvalidRouteError') {
        /** @TODO Create useful form validation */
        alert('Invalid route');
      }
      else { throw e; }
    }
  };


  /** @private */
  SaveRouteController.prototype.publishSavedRoute_ = function(route) {
    this.eventHub_.trigger('route:save', route);
  };


  return SaveRouteController;
});
