define([
  'aeris/util',
  'aeris/model',
  'aeris/application/controllers/itemcontroller'
], function(_, Model, ItemController) {
  /**
   * @class InfoPanelController
   * @namespace aeris.builder.routes.routebuilder.routepointinfo.controllers
   * @extends aeris.application.ItemController
   *
   * @constructor
   * @override
   */
  var InfoPanelController = function(options) {
    this.routeBuilder_ = options.routeBuilder;

    this.viewModel_ = null;

    ItemController.apply(this, arguments);

    this.viewModel_ = this.createViewModelFromType_(options.InfoPanelViewModel);

    this.declareUI('deleteBtn', 'closeBtn');

    this.listenToOnce(this, {
      render: function() {
        this.setupUIBindings_();
        this.setupRoutePointBindings_();
      }
    });
  };
  _.inherits(InfoPanelController, ItemController);


  InfoPanelController.prototype.setupUIBindings_ = function() {
    this.bindUIEvent('click', 'deleteBtn', this.removeRoutePoint_, this);
    this.bindUIEvent('click', 'closeBtn', this.close, this);
  };


  InfoPanelController.prototype.setupRoutePointBindings_ = function() {
    var routePoint = this.model;

    this.listenTo(routePoint, {
      'remove deselect': function() {
        this.close();
      },
      'change:position change:distance': function() {
        this.render();
      }
    });

    this.setupBindingsToSurroundingRoutePoints_();
  };


  InfoPanelController.prototype.setupBindingsToSurroundingRoutePoints_ = function() {
    var routePoint = this.model;
    var route = routePoint.getRoute();

    this.listenTo(route, {
      'reset': function(collection) {
        if (!collection.contains(routePoint)) {
          this.close();
        }
      },
      'remove': function(removedRoutePoint) {
        if (removedRoutePoint !== routePoint) {
          this.render();
        }
      },
      'add change:position': function() {
        this.render();
      }
    });
  };


  /**
   * @method serializeData
   */
  InfoPanelController.prototype.serializeData = function() {
    this.viewModel_.syncToModel();
    return this.viewModel_.toJSON();
  };


  InfoPanelController.prototype.createViewModelFromType_ = function(ViewModel) {
    return new ViewModel(null, {
      data: this.model
    });
  };


  InfoPanelController.prototype.removeRoutePoint_ = function() {
    var route = this.routeBuilder_.getRoute();

    route.remove(this.model);
  };


  InfoPanelController.prototype.onBeforeClose = function() {
    this.viewModel_.destroy();
    this.model.deselect();
    this.stopListening();
  };


  InfoPanelController.prototype.transitionIn_ = function(opt_duration, opt_cb, opt_ctx) {
    var cb = opt_cb || function() {};
    this.ui.transitionTarget.hide();
    this.ui.transitionTarget.fadeIn(100, _.bind(cb, opt_ctx));

    return this;
  };


  InfoPanelController.prototype.transitionOut_ = function(opt_duration, opt_cb, opt_ctx) {
    var cb = opt_cb || function() {};
    this.ui.transitionTarget.fadeOut(100, _.bind(cb, opt_ctx));

    return this;
  };


  return InfoPanelController;
});
