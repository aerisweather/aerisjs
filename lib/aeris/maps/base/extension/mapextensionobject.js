define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'aeris/errors/validationerror',
  'aeris/model'
], function(_, InvalidArgumentError, ValidationError, BaseModel) {
  /**
   * An abstraction for an object to be handled by a map extension.
   *
   * A MapExtensionObject holds meta-data about view being rendered
   * on a map; for example, the color of a polyline, the opacity of
   * a layer, the url endpoint for fetching tile images.
   *
   * It should be noted that while MapExtensionObject extends from
   * {aeris.Model}, the data that is contains is all concerning
   * the rendering of a view.
   *
   * A MapExtensionObject creates a strategy, whose job is to render
   * the metadata held by a MapExtObj onto a map. The MapExtObj tells
   * the strategy about itself, then let's the strategy do it's thing.
   *
   * @override
   * @param {Object=} opt_attrs
   * @param {Object=} opt_options
   * @param {aeris.maps.AbstractStrategy|String} opt_options.strategy
   *        The strategy object constructor to use to interact
   *        with the layer's map API.
   *
   *        OR
   *
   *        The path to the strategy object (without the
   *        map strategy prefix). eg. 'layerstrategies/sometiletype'.
   *        This is the preferred param format for development,
   *        as it limits the number of Strategy modules which
   *        need to be loaded in through a MapExtObj's class heirarchy.
   *
   *        Note that this options will result in the Strategy being
   *        loaded asynchronously.
   *
   * @constructor
   * @class aeris.maps.extension.MapExtensionObject
   * @extends aeris.Model
   */
  var MapExtensionObject = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      map: null
    }, opt_attrs);


    /**
     * Default {aeris.Strategy} implementation
     *
     * @property strategy_
     * @type {aeris.maps.Strategy} Strategy constructor.
     */


    /**
     * An AerisMap that the object is bound to. This is set with setMap.
     *
     * @attribute map
     * @type {aeris.maps.Map}
     * @protected
     */


    /**
     * A name/type for the object.
     *
     * @attribute name
     * @type {string}
     */


    /**
     * The strategy used to interact
     * with the map view.
     *
     * @property strategy
     * @type {aeris.maps.layerstrategies.AbstractLayerStrategy}
     * @protected
     */

    BaseModel.call(this, attrs, opt_options);

    /**
     * Triggered when a map is set to a
     * MapExtensionObject.
     *
     * @event 'map:set'
     * @param {aeris.maps.extensions.MapExtensionObject} model
     * @param {aeris.maps.Map} map
     * @param {Object} options
     */
    /**
     * Triggered when a map is removed from
     * a MapExtensionObject (ie, map was set to null).
     *
     * @event 'map:remove'
     * @param {aeris.maps.extensions.MapExtensionObject} model
     * @param {null} map
     * @param {Object} options
     */
    this.listenTo(this, {
      'change:map': function(model, value, options) {
        var topic = this.hasMap() ? 'map:set' : 'map:remove';
        this.trigger(topic, model, value, options);
      }
    });
  };

  _.inherits(MapExtensionObject, BaseModel);


  /**
   * @override
   */
  MapExtensionObject.prototype.initialize = function(attrs, options) {
    var self = this;

    options || (options = {});

    if (!options.strategy) {
      throw new InvalidArgumentError('MapExtensionObject requires a Strategy');
    }


    // Create strategy
    if (_.isFunction(options.strategy)) {
      this.strategy_ = new options.strategy(this);
    }
    else if (_.isString(options.strategy)) {
      require(['strategy/' + options.strategy], function(Strategy) {
        this.strategy_ = new Strategy(self);
      });
    }
    else {
      throw new InvalidArgumentError('MapExtensionObject requires a Strategy');
    }
  };


  /**
   * @return {aeris.errors.ValidationError|undefined}
   * @override
   */
  MapExtensionObject.prototype.validate = function(attrs) {
    if (attrs.map !== null && !(attrs.map instanceof aeris.maps.Map)) {
      return new ValidationError('Aeris Map', 'Invalid map object');
    }
  };


  /**
   * Set the map.
   *
   * @param {aeris.maps.Map} aerisMap The map to bind to.
   */
  MapExtensionObject.prototype.setMap = function(aerisMap) {
    this.set('map', aerisMap, { validate: true });
  };

  /**
   * Get the map.
   *
   * @return {aeris.maps.Map}
   */
  MapExtensionObject.prototype.getMap = function() {
    return this.get('map');
  };


  /**
   * @return {Boolean} Returns true if the layer has a map set.
   */
  MapExtensionObject.prototype.hasMap = function() {
    return this.has('map');
  };


  return MapExtensionObject;

});
