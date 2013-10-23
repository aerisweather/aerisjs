define([
  'aeris/util',
  'vendor/marionette',
  'mapbuilder/core/controller/mapobjectcontroller'
], function(_, Marionette, MapObjectController) {
  /**
   * Controls a set of {aeris.maps.extensions.MapExtensionObject}
   * view objects.
   *
   * @class aeris.builder.maps.map.controller.MapObjectCollectionController
   * @extends Marionette.CollectionView
   *
   * @param {Object=} opt_options
   * @param {aeris.SimpleCollection} opt_options.collection
   *        A simple collection of {string} names corresponding to
   *        {aeris.maps.extensions.MapExtensionObject} classes,
   *        as referenced within the {aeris.maps} namespace.
   *
   * @constructor
   */
  var MapObjectCollectionController = function(opt_options) {
    var options = _.extend({
      itemView: MapObjectController,

      // Note that item view options defaults
      // are set in this.itemViewOptions definition
      itemViewOptions: {}
    }, opt_options);

    // Parse passed-in itemViewOptions as either
    // an object, or a fn returning an object
    var itemViewOptions = _.isFunction(options.itemViewOptions) ?
      options.itemViewOptions() : options.itemViewOptions;

    // Wrap the itemViewOptions in a function
    // so that we can pull in values when the itemView is rendered
    options.itemViewOptions = function() {
      return _.extend({
        // Pull in the map, as defined
        // when the item views are rendered.
        // (rather an as defined when the Controller is instantiated).
        map: this.map_
      }, itemViewOptions);
    };


    /**
     * A simple collection of map object class names
     *
     * @type {aeris.SimpleCollection}
     */
    this.collection;


    Marionette.CollectionView.call(this, options);
  };
  _.inherits(MapObjectCollectionController, Marionette.CollectionView);


  /**
   * Sets a Map to associate with all child controller's objects.
   *
   * @param {aeris.maps.Map} map
   */
  MapObjectCollectionController.prototype.setMap = function(map) {
    this.map_ = map;

    // Add to all child views
    this.children.each(function(child) {
      child.setMap(this.map_);
    }, this);
  };


  return MapObjectCollectionController;
});
