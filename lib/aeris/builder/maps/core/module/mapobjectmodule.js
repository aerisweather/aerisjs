define([
  'aeris/util',
  'mapbuilder/core/module/statemodule',
  'aeris/errors/invalidargumenterror'
], function(_, StateModule, InvalidArgumentError) {
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
   * @param {string} options.stateAttr
   */
  var MapObjectModule = function(options) {


    /**
     * @type {aeris.builder.maps.core.controller.MapObjectCollectionController}
     * @private
     */
    this.mapObjectController_ = options.mapObjectController;


    StateModule.call(this, options);
  };
  _.inherits(MapObjectModule, StateModule);


  /**
   * Render controllers managed by this module.
   *
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} builderOptions
   */
  MapObjectModule.prototype.render = function(builderOptions) {
    StateModule.prototype.render.apply(this, arguments);

    this.renderMapObjects_(builderOptions);
  };


  /**
   * Convert mapObjectOptions into
   * the format for a {aeris.application.form.model.Toggle} model.
   *
   * @param {Array.<Object>} mapObjectOptions
   *
   * @override
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
   */
  MapObjectModule.prototype.processMapObjectOption_ = function(mapObjectOption) {
    if (!_.isObject(mapObjectOption)) {
      throw new InvalidArgumentError('Unable to process app builder configuration: expected ' +
        this.stateAttr_ + ' option to be an array of objects');
    }

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


  return MapObjectModule;
});
