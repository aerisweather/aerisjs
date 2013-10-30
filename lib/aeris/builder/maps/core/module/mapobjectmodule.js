define([
  'aeris/util',
  'mapbuilder/core/module/statemodule'
], function(_, StateModule) {
  /**
   * A base module for rendering and controlling {aeris.maps.extensions.MapExtensionObject}s.
   *
   * @class aeris.builder.maps.core.modules.MapObjectModule
   * @extends aeris.builder.maps.core.modules.StateModule
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   *
   * @param {aeris.builder.maps.core.controller.MapObjectCollectionController} options.mapObjectController
   * @param {aeris.builder.maps.core.controller.MapObjectSelectController} options.selectController
   * @param {aeris.builder.maps.core.collection.MapObjectStateCollection} options.moduleState
   * @param {aeris.builder.maps.core.collection.MapObjectStateCollection} options.appStateAttr
   * @param {string} options.stateAttr
   */
  var MapObjectModule = function(options) {


    /**
     * @type {aeris.builder.maps.core.controller.MapObjectCollectionController}
     * @private
     */
    this.mapObjectController_ = options.mapObjectController;


    /**
     * @type {aeris.builder.maps.core.controller.MapObjectSelectController}
     * @private
     */
    this.selectController_ = options.selectController;


    /**
     * The state
     * of our map objects module.
     *
     * @type {aeris.builder.maps.core.collection.MapObjectStateCollection}
     */
    this.moduleState_ = options.moduleState;


    /**
     * The attr by which the map objects are referenced
     * within the application state.
     *
     * This should also be how the objects are referenced within
     * the builder config.
     *
     * @type {string}
     * @private
     */
    this.stateAttr_ = options.appStateAttr;


    StateModule.call(this, options);


    // Add objects listed in builder options to the state
    this.addInitializer(this.registerState_);
  };
  _.inherits(MapObjectModule, StateModule);


  /**
   * Render controllers managed by this module.
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} builderOptions
   */
  MapObjectModule.prototype.render = function(builderOptions) {
    this.renderMapObjects_(builderOptions);

    if (builderOptions.get('controls')[this.stateAttr_]) {
      this.renderControls_(builderOptions);
    }
  };


  /**
   * Register the state of this module
   * with the application state.
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} builderOptions AppBuilder build config.
   * @protected
   */
  MapObjectModule.prototype.registerState_ = function(builderOptions) {
    var moduleOptions = builderOptions.get(this.stateAttr_);

    // Convert builder options config
    // to state objects.
    var moduleStateObjects = _.map(moduleOptions, this.processBuilderOption_, this);

    this.moduleState_.add(moduleStateObjects);

    // Register module state with the application state
    this.appState_.set(this.stateAttr_, this.moduleState_);
  };


  /**
   * Process a map object configuration option from the
   * {aeris.builder.maps.options.MapAppBuilderOptions} builder options,
   * in order for it to be added to the module state.
   *
   * @protected
   *
   * @param {Object} mapObjectOption
   *        eg. {
   *              name: 'StormReportMarkers',
   *              default: false,
   *              filters: ['wind', 'tornado']
   *            }.
   *
   * @return {Object} State object to be added to the module state collection.
   */
  MapObjectModule.prototype.processBuilderOption_ = function(mapObjectOption) {
    // Convert to a Toggle object.
    return {
      value: mapObjectOption.name,
      selected: mapObjectOption.default
    };
  };


  /**
   * Render the MapObjectCollectionController
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} builderOptions
   *
   * @private
   */
  MapObjectModule.prototype.renderMapObjects_ = function(builderOptions) {
    this.mapObjectController_.render();
  };


  /**
   * Render the MapObjectSelectController.
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} builderOptions
   * @private
   */
  MapObjectModule.prototype.renderControls_ = function(builderOptions) {
    // Render the controls
    this.region_.show(this.selectController_);
  };


  return MapObjectModule;
});
