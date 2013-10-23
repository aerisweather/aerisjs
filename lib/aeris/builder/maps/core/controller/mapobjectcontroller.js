define([
  'aeris/util',
  'vendor/backbone',
  'aeris/errors/invalidargumenterror'
], function(_, Backbone, InvalidArgumentError) {
  /**
   * Handles all interactions with individual
   * {aeris.maps.extensions.MapExtensionObject} objects.
   *
   * @class aeris.builers.maps.map.controller.MapObjectController
   * @extends Backbone.View
   *
   * @param {Object} options
   * @param {aeris.SimpleModel} options.model
   * @param {aeris.maps.Map} options.map
   * @param {Object|string} mapObjectNS
   *        The namespace in which to look for the MapExtObj constructor.
   *        Can be an object, or a dot-notated string.
   *
   *
   * @constructor
   */
  var MapObjectController = function(options) {
    options = _.extend({
      mapObjectNS: aeris.maps,
      map: null
    }, options);

    /**
     * A simple model, whose value is
     * the {string} name of the map object class.
     *
     * Use this.model.getValue() to get the map object class name.
     *
     * @property model
     * @type {aeris.SimpleModel}
     */
    this.model;


    /**
     * @private
     * @type {aeris.maps.Map}
     */
    this.map_ = options.map;


    /**
     * Map object view
     *
     * @private
     * @type {aeris.maps.extension.MapExtensionObject}
     */
    this.view_;


    /**
     * The namespace in which to look for
     * the MapExtObj constructor.
     * Can be an object, or a dot-notated string.
     *
     * @type {Object}
     * @default aeris.maps
     * @private
     */
    this.mapObjectNS_ = options.mapObjectNS;

    if (options.map) {
      this.setMap(options.map);
    }

    Backbone.View.call(this, options);
  };
  _.inherits(MapObjectController, Backbone.View);


  /**
   * Creates a {aeris.maps.extension.MapExtensionObject} object,
   * and sets to to the map.
   */
  MapObjectController.prototype.render = function() {
    var MapObject = this.getMapObjectCtor_();

    this.view_ = new MapObject();

    if (this.map_) {
      this.view_.setMap(this.map_);
    }
  };


  /**
   * Remove the object from the map.
   */
  MapObjectController.prototype.close = function() {
    this.view_.setMap(null);
    this.stopListening();
  };


  /**
   * Associates a map with this controller, on which
   * to render map objects.
   *
   * If the view is rendered,
   * sets the view to the map.
   *
   * @param {aeris.maps.Map} map
   */
  MapObjectController.prototype.setMap = function(map) {
    // Map can either be a Map or null.
    if (!(map instanceof aeris.maps.Map) && !_.isNull(map)) {
      throw new InvalidArgumentError('Unable to set MakerController map: invalid map');
    }

    this.map_ = map;

    if (this.view_) {
      this.view_.setMap(map);
    }
  };


  /**
   * Looks for a map object constructor within
   * the aeris.maps namespace corresponding
   * to the collection's model value.
   *
   * @throws {Error} If no constructor is found
   *
   * @return {aeris.maps.extension.MapExtensionObject} Constructor.
   * @private
   */
  MapObjectController.prototype.getMapObjectCtor_ = function() {
    var ctor;
    var mapObjectNS = _.isString(this.mapObjectNS_) ? _.path(this.mapObjectNS_) : this.mapObjectNS_;

    var fail = _.bind(function() {
      throw new Error('Unable to find a map object with name ' +
        '\'' + this.model.getValue() + '\'' +
        ' within the \'' + mapObjectNS + '\' namespace');
    }, this);

    try {
      ctor = mapObjectNS[this.model.getValue()];
    }
    catch (e) {
      fail();
    }

    if (!_.isFunction(ctor)) {
      fail();
    }

    return ctor;
  };


  return MapObjectController;
});
