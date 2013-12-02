define([
  'aeris/util',
  'vendor/backbone'
], function(_, Backbone) {
  /**
   * Controls the map controls view.
   *
   * @class aeris.builder.maps.mapcontrols.controller.ControlsController
   * @extends Backbone.View
   *
   * @constructor
   *
   * @param {Object} options
   * @param {aeris.Events} options.eventHub Required.
   * @param {aeris.builder.options.AppBuilderOptions} options.builderOptions Required.
  */
  var ControlsController = function(options) {
    /**
     * Application event hub.
     *
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;


    /**
     * App builder options
     *
     * @type {aeris.builder.options.AppBuilderOptions}
     * @private
     */
    this.builderOptions_ = options.builderOptions;


    Backbone.View.apply(this, arguments);
  };
  _.inherits(ControlsController, Backbone.View);


  /**
   * Setup view bindings
   */
  ControlsController.prototype.render = function() {
    // Request controls views.
    this.listenTo(this.eventHub_, 'mapControls:ready', function(controller, name) {
      if (_(this.getControlsList_()).contains(name)) {
        this.addControls(controller);
      }
    });
  };


  /**
   * Clean up.
   */
  ControlsController.prototype.close = function() {
    this.stopListening();
    this.$el.remove();
  };


  /**
   * Add a view to the
   * controls view.
   *
   * @param {Backbone.View} controller
   */
  ControlsController.prototype.addControls = function(controller) {
    this.$el.append(controller.$el);
  };


  ControlsController.prototype.getControlsList_ = function() {
    var opts = this.builderOptions_.get('controls');
    var list = [];

    _.each(opts, function(isSelected, controlType) {
      if (isSelected) {
        list.push(controlType);
      }
    }, this);

    return list;
  };


  return ControlsController;
});
