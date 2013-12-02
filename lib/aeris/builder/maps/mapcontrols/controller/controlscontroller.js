define([
  'aeris/util',
  'application/controller/layoutcontroller',
  'aeris/errors/invalidargumenterror',
  'vendor/marionette'
], function(_, LayoutController, InvalidArgumentError, Marionette) {
  /**
   * Controls the map controls view.
   *
   * @class aeris.builder.maps.mapcontrols.controller.ControlsController
   * @extends aeris.application.controller.LayoutController
   *
   * @constructor
   *
   * @param {Object} options
   * @param {aeris.Events} options.eventHub Required.
   * @param {aeris.builder.options.AppBuilderOptions} options.builderOptions Required.
   * @param {Object.<string,string>=} options.controlsRegions
   * @param {string=} options.selectedClass
   * @param {string=} options.deselectedClass
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


    /**
     * Lookup region names from
     * control view names.
     *
     * @type {Object.<string,string>}
     * @private
     */
    this.controlsRegions_ = options.controlsRegions || {};


    /**
     * HTML Class name to apply to a selected
     * element.
     *
     * @type {string}
     * @private
     */
    this.selectedClass_ = options.selectedClass || '';


    /**
     * HTML Class name to apply to a deselected
     * element.
     *
     * @type {string}
     * @private
     */
    this.deselectedClass_ = options.deselectedClass || '';


    /**
     * UI Elements:
     *    mapControlsToggle
     */
    options.ui = _.defaults(options.ui || {}, {
      mapControlsToggle: ''
    });


    LayoutController.call(this, options);

    this.bindUIEvent('click', 'mapControlsToggle', this.toggleMapControls_);
  };
  _.inherits(ControlsController, LayoutController);


  /**
   * Setup view bindings
   */
  ControlsController.prototype.render = function() {
    this.startRenderingControlsFromEvents_();

    LayoutController.prototype.render.apply(this, arguments);
  };


  /**
   * @private
   */
  ControlsController.prototype.startRenderingControlsFromEvents_ = function() {
    // Request controls views.
    this.listenTo(this.eventHub_, 'mapControls:ready', this.renderControlsFromEvent_);
  };


  /**
   * @param {LayoutController} controller
   * @param {string} controlsViewName
   * @private
   */
  ControlsController.prototype.renderControlsFromEvent_ = function(controller, controlsViewName) {
    if (this.isConfiguredToRender(controlsViewName)) {
      this.renderControlsView(controller, controlsViewName);
    }
  };


  /**
   * Is the controller configured to render this
   * type of controller?
   *
   * @param {string} controlsViewName
   * @return {Boolean}
   */
  ControlsController.prototype.isConfiguredToRender = function(controlsViewName) {
    return _(this.getAllowedControlsViewNames_()).contains(controlsViewName);
  };


  /**
   * Add a view to the
   * controls view.
   *
   * @throw {aeris.errors.InvalidArgumentError}
   *        If no region is associated with the controlsViewName.
   *
   * @param {LayoutController} controller
   * @param {string} controlsViewName
   */
  ControlsController.prototype.renderControlsView = function(controller, controlsViewName) {
    var controlsRegion = this.getControlsRegion(controlsViewName);
    
    if (!controlsRegion) {
      throw new InvalidArgumentError('Unable to render \'' + controlsViewName + '\' ' +
        'controls: No region is defined in which to render the view');
    }

    controlsRegion.show(controller);
  };


  /**
   * @param {string} controlsViewName
   * @return {Marionette.Region|undefined}
   */
  ControlsController.prototype.getControlsRegion = function(controlsViewName) {
    var regionName = this.controlsRegions_[controlsViewName];
    var region = this[regionName];
    var isRegionCorrectType = region instanceof Marionette.Region;

    return isRegionCorrectType ? region : undefined;
  };


  /**
   * 
   * @returns {Array}
   * @private
   */
  ControlsController.prototype.getAllowedControlsViewNames_ = function() {
    var controlsConfig  = this.builderOptions_.get('controls');
    var list = [];

    _.each(controlsConfig, function(isControlActive, controlType) {
      if (isControlActive) {
        list.push(controlType);
      }
    }, this);

    return list;
  };


  /**
   * Toggle map controls view.
   *
   * @private
   */
  ControlsController.prototype.toggleMapControls_ = function() {
    this.ui.mapControlsToggle.toggleClass(this.selectedClass_);
    this.ui.mapControlsToggle.toggleClass(this.deselectedClass_);
  };


  /**
   * Clean up.
   */
  ControlsController.prototype.close = function() {
    this.stopListening();
    this.$el.remove();
  };


  return ControlsController;
});
