define([
  'aeris/util',
  'aeris/model',
  'application/controller/itemcontroller'
], function(_, Model, ItemController) {
  /**
   * @class aeris.builder.routes.routebuilder.routepointinfo.controller.InfoPanelController
   * @extends aeris.application.ItemController
   *
   * @constructor
   * @override
  */
  var InfoPanelController = function(options) {
    this.model = options.model || new Model();
    
    this.routeBuilder_ = options.routeBuilder;

    ItemController.apply(this, arguments);
    
    this.declareUI('deleteBtn');
    
    this.listenTo(this, 'render', this.listenToUI_);
    this.listenTo(this, 'render', this.listenToRouteBuilder_);
  };
  _.inherits(InfoPanelController, ItemController);


  InfoPanelController.prototype.resetData = function(data) {
    this.model.set(data);
  };
  
  
  InfoPanelController.prototype.listenToUI_ = function() {
    this.bindUIEvent('click', 'deleteBtn', this.removeRoutePoint_, this);
  };


  InfoPanelController.prototype.listenToRouteBuilder_ = function() {
    var route = this.routeBuilder_.getRoute();

    this.listenTo(route, {
      'remove reset': function() {
        
      }
    });
  };
  
  
  InfoPanelController.prototype.removeRoutePoint_ = function() {
    
  };


  return InfoPanelController;
});
