define([
  'aeris/util',
  'aeris/builder/maps/core/modules/statemodule',
  'aeris/errors/invalidargumenterror'
], function(_, StateModule, InvalidArgumentError) {
  /**
   * A base module for rendering and controlling {aeris.maps.extensions.MapExtensionObject}s.
   *
   * @class MapObjectModule
   * @namespace aeris.builder.maps.core.modules
   * @extends aeris.builder.maps.core.modules.StateModule
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   *
   * @param {aeris.builder.maps.core.controllers.MapObjectCollectionController} options.mapObjectController
   * @param {Backbone.View=} options.controlsController Optional.
   * @param {string} options.stateAttr
   */
  var MapObjectModule = function(options) {

    /**
     * Controls controller.
     *
     * @type {?Backbone.View}
     * @private
     * @property controlsController_
     */
    this.controlsController_ = options.controlsController || null;


    /**
     * @type {aeris.builder.maps.core.controllers.MapObjectCollectionController}
     * @private
     * @property mapObjectController_
     */
    this.mapObjectController_ = options.mapObjectController;


    StateModule.call(this, options);

    this.addInitializer(this.renderControllers_);
  };
  _.inherits(MapObjectModule, StateModule);


  /**
   * Convert mapObjectOptions into
   * the format for a {aeris.application.forms.models.Toggle} model.
   *
   * @param {Array.<Object>} mapObjectOptions
   *
   * @override
   * @method processBuilderOptions_
   */
  MapObjectModule.prototype.processBuilderOptions_ = function(mapObjectOptions) {
    if (!_.isArray(mapObjectOptions)) {
      throw new InvalidArgumentError('Unable to process app builder configuration: expected ' +
        this.stateAttr_ + ' option to be an array of object');
    }

    return _(mapObjectOptions).map(this.processMapObjectOption_, this);
  };


  /**
   * Processes a single option object
   * from the builderOptions.
   *
   * @param {Object} mapObjectOption
   *
   * @protected
   * @method processMapObjectOption_
   */
  MapObjectModule.prototype.processMapObjectOption_ = function(mapObjectOption) {
    if (!_.isObject(mapObjectOption)) {
      throw new InvalidArgumentError('Unable to process app builder configuration: expected ' +
        this.stateAttr_ + ' option to be an array of objects');
    }

    // Convert to a Toggle object.
    return {
      type: mapObjectOption.type,
      class: mapObjectOption.class || mapObjectOption.type,
      selected: mapObjectOption.selected
    };
  };


  /**
   * Render controllers associated with this module.
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} builderOptions
   *
   * @private
   * @method renderControllers_
   */
  MapObjectModule.prototype.renderControllers_ = function(builderOptions) {
    this.mapObjectController_.render();

    if (this.controlsController_) {
      this.controlsController_.triggerReadyEvent();
    }
  };


  return MapObjectModule;
});
