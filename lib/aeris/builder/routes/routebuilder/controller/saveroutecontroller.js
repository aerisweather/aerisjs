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
      'closeBtn',
      'loading',
      'errorMsg',
      'distance',
      'length'
    );

    this.ui.formInputs = [this.ui.nameInput, this.ui.descrInput].join(', ');
    this.ui.buttons = [this.ui.saveBtn, this.ui.closeBtn].join(', ');

    this.listenToOnce(this, 'render', this.setupUIBindings_);
    this.listenToOnce(this, 'render', this.setupEventHubBindings_);
    this.listenToOnce(this, 'render', this.setupRouteBuilderBindings_);
    this.listenTo(this, 'save', this.showLoading_);
    this.listenTo(this, 'save', this.closeErrorMessage_);
  };
  _.inherits(SaveRouteController, ItemController);


  SaveRouteController.prototype.serializeData = function() {
    var route = this.routeBuilder_.getRoute();
    var METERS_PER_MILE = 1609.34;
    var routeDistanceInMiles = route.distance / METERS_PER_MILE;

    return {
      route: {
        distance: routeDistanceInMiles.toFixed(1),
        length: route.length
      }
    }
  };


  /** @private */
  SaveRouteController.prototype.setupUIBindings_ = function() {
    this.bindUIEvent('click', 'saveBtn', this.saveRoute_, this);
    this.bindUIEvent('click', 'closeBtn', function() {
      this.close();
    }, this);
    this.bindUIEvent('click focus change', 'formInputs', this.closeErrorMessage_, this);
    this.bindUIEvent('click', 'buttons', this.preventEventDefault_, this);
  };


  SaveRouteController.prototype.setupEventHubBindings_ = function() {
    this.listenTo(this.eventHub_, {
      'save:start': this.showLoading_,
      'save:complete': function() {
        this.hideLoading_();
        this.close();
      },
      'save:error': function (e) {
        this.handleSaveError_(e);
        this.hideLoading_();
      }
    });
  };


  /** @private */
  SaveRouteController.prototype.setupRouteBuilderBindings_ = function() {
    this.listenTo(this.routeBuilder_.getRoute(), {
      'all': this.closeErrorMessage_,
      'add remove change:distance': this.renderRouteDetails_
    })
  };


  /** @private */
  SaveRouteController.prototype.saveRoute_ = function() {
    var routeModelData = this.getRouteData_();
    var routeModel = this.createRouteModel_(routeModelData);
    var validationError = this.validateRouteModel_(routeModel);

    if (validationError) {
      this.renderErrorMessage_('Invalid route: ' + validationError.message);
      return;
    }

    this.publishSavedRoute_(routeModel.toJSON());

    this.trigger('save');
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


  /**
   * @private
   * @return {Error}
   */
  SaveRouteController.prototype.validateRouteModel_ = function(routeModel) {
    var validationError;

    try {
      routeModel.isValid();
    }
    catch (e) {
      if (e.name === 'InvalidRouteError') {
        validationError = e;
      }
      else { throw e; }
    }

    return validationError;
  };


  /** @private */
  SaveRouteController.prototype.publishSavedRoute_ = function(route) {
    this.eventHub_.trigger('route:export', route);
  };


  /** @private */
  SaveRouteController.prototype.preventEventDefault_ = function(evt) {
    evt.preventDefault();
    return false;
  };


  /** @private */
  SaveRouteController.prototype.showLoading_ = function() {
    this.ui.loading.slideDown(100);
  };


  /** @private */
  SaveRouteController.prototype.hideLoading_ = function() {
    this.ui.loading.slideUp(100);
  };


  /** @private */
  SaveRouteController.prototype.handleSaveError_ = function(e) {
    this.renderErrorMessage_('Unable to save route: ' + e.message);
  };


  /** @private */
  SaveRouteController.prototype.renderErrorMessage_ = function(message) {
    this.ui.errorMsg.text(message);
    this.ui.errorMsg.slideDown(150);
  };


  /** @private */
  SaveRouteController.prototype.closeErrorMessage_ = function() {
    this.ui.errorMsg.text('');
    this.ui.errorMsg.slideUp(150);
  };


  SaveRouteController.prototype.renderRouteDetails_ = function() {
    var viewData = this.serializeData();
    this.ui.distance.text(viewData.route.distance);
    this.ui.length.text(viewData.route.length);
  };

  return SaveRouteController;
});
