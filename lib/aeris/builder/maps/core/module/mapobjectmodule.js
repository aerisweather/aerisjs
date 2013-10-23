define([
  'aeris/util',
  'mapbuilder/core/module/routedmodule'
], function(_, RoutedModule) {
  /**
   * A base module for rendering and controlling {aeris.maps.extensions.MapExtensionObject}s.
   *
   * @class aeris.builder.maps.core.modules.MapObjectModule
   * @extends aeris.builder.maps.core.modules.RoutedModule
   *
   * @constructor
   * @override
   */
  var MapObjectModule = function(options) {


    /**
     * @type {Marionette.Region}
     * @private
     */
    this.region_ = options.layout[options.regionName];


    /**
     * Lookup map object labels based on their names.
     * eg.
     *  { 'StormReportMarkers': 'Storm Reports' }
     *
     * Note that if any labels are missing,
     * the {aeris.builder.maps.core.model.Toggle} autoLabel
     * will attempt to create a label.
     *
     * @type {Object.<string,string>}
     * @private
     */
    this.labelLookup_ = options.labelLookup;


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
     * The on/off application state
     * of our map objects
     *
     * @type {aeris.SimpleCollection} As an {Array.<string>}.
     */
    this.stateItems_ = options.stateItems;


    /**
     * The attr by which the map objects are referenced
     * within the state.
     *
     * This should also be how the objects are referenced within
     * the builder config.
     *
     * @type {string}
     * @private
     */
    this.stateAttr_ = options.stateAttr;


    RoutedModule.call(this, options);

    // Register map objects with state
    this.state_.set(this.stateAttr_, this.stateItems_);


    // Add objects listed in builder options to the state
    this.addInitializer(function(builderOptions) {
      var toAdd = _(builderOptions.get(this.stateAttr_)).where({
        default: true
      });
      toAdd = _(toAdd).pluck('name');

      this.stateItems_.add(toAdd);
    });


    // Render the module
    this.addInitializer(this.render);
  };
  _.inherits(MapObjectModule, RoutedModule);


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
   * Render the MapObjectCollectionController
   * @private
   */
  MapObjectModule.prototype.renderMapObjects_ = function(builderOptions) {
    this.mapObjectController_.render();
    this.mapObjectController_.setMap(this.state_.get('map'));

    // Bind map objects controller to the application map.
    this.listenTo(this.state_, 'change:map', function(model, map) {
      this.mapObjectController_.setMap(map);
    });
  };


  /**
   * Render the MapObjectSelectController.
   *
   * @param builderOptions
   * @private
   */
  MapObjectModule.prototype.renderControls_ = function(builderOptions) {
    var controlModels = [];

    // Setup controls view collection
    // From config
    _.each(builderOptions.get(this.stateAttr_), function(objConfig) {
      controlModels.push({
        name: objConfig.name,
        label: this.labelLookup_[objConfig.name],
        selected: objConfig.default
      });
    }, this);

    this.selectController_.collection.add(controlModels);

    // Render the controls
    this.region_.show(this.selectController_);
  };


  return MapObjectModule;
});
