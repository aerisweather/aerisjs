define([
  'aeris/util',
  'application/controller/layoutcontroller',
  'errors/invalidargumenterror',
  'vendor/marionette'
], function(_, LayoutController, InvalidArgumentError, Marionette) {
  /**
   * Controls the map controls view.
   *
   * @class aeris.builder.maps.mapcontrols.controller.MapControlsController
   * @extends aeris.application.controller.LayoutController
   *
   * @constructor
   *
   * @param {Object} options
   * @param {aeris.Events} options.eventHub Required.
   * @param {aeris.builder.options.AppBuilderOptions} options.builderOptions Required.
   * @param {Object.<string,string>=} options.controlsRegionLookup
   * @param {string=} options.selectedClass
   * @param {string=} options.deselectedClass
  */
  var MapControlsController = function(options) {
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
    this.controlsRegionLookup_ = options.controlsRegionLookup || {};


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
     *    mapOptionsToggle
     */
    options.ui = _.defaults(options.ui || {}, {
      mapOptionsToggle: ''
    });


    LayoutController.call(this, options);

    this.bindUIEvent('click', 'mapOptionsToggle', this.toggleMapControls_, this);
  };
  _.inherits(MapControlsController, LayoutController);


  /**
   * Setup view bindings
   */
  MapControlsController.prototype.render = function() {
    this.startRenderingControlsFromEvents_();

    LayoutController.prototype.render.apply(this, arguments);

    // We want to start out with all regions
    // hidden, so we don't have funky empty container
    // UI all over the place.
    this.hideAllRegions();
  };


  /**
   * @private
   */
  MapControlsController.prototype.startRenderingControlsFromEvents_ = function() {
    // Request controls views.
    this.listenTo(this.eventHub_, 'mapControls:ready', this.renderControlsFromEvent_);
  };


  /**
   * @param {LayoutController} controller
   * @param {string} controlsViewName
   * @private
   */
  MapControlsController.prototype.renderControlsFromEvent_ = function(controller, controlsViewName) {
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
  MapControlsController.prototype.isConfiguredToRender = function(controlsViewName) {
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
  MapControlsController.prototype.renderControlsView = function(controller, controlsViewName) {
    var controlsRegion = this.getControlsRegion(controlsViewName);
    
    if (!controlsRegion) {
      throw new InvalidArgumentError('Unable to render \'' + controlsViewName + '\' ' +
        'controls: No region is defined in which to render the view');
    }

    controlsRegion.show(controller);
    controlsRegion.$el.css('display', '');
  };


  /**
   * @param {string} controlsViewName
   * @return {Marionette.Region|undefined}
   */
  MapControlsController.prototype.getControlsRegion = function(controlsViewName) {
    var regionName = this.controlsRegionLookup_[controlsViewName];
    var region = this[regionName];
    var isRegionCorrectType = region instanceof Marionette.Region;

    return isRegionCorrectType ? region : undefined;
  };


  /**
   * 
   * @returns {Array}
   * @private
   */
  MapControlsController.prototype.getAllowedControlsViewNames_ = function() {
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
   * @private
   */
  MapControlsController.prototype.toggleMapControls_ = function() {
    this.ui.mapOptionsContent.toggleClass(this.selectedClass_);
    this.ui.mapOptionsContent.toggleClass(this.deselectedClass_);
  };


  /**
   * Clean up.
   */
  MapControlsController.prototype.close = function() {
    this.stopListening();
    this.$el.remove();
  };


  return MapControlsController;
});
