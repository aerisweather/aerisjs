define([
  'aeris/util',
  'aeris/model',
  'aeris/collection',
  'aeris/builder/maps/core/collections/mapobjecttogglecollection'
], function(_, BaseModel, Collection, MapObjectToggleCollection) {
  /**
   * The common state of the builder application.
   *
   * The state information held by this object
   * is limited to data which is common between all
   * application modules.
   *
   * @class State
   * @namespace aeris.builder.maps.core.models
   * @extends aeris.Model
   * @implements aeris.maps.MapObjectInterface
   *
   * @constructor
   */
  var State = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      map: null
    }, opt_attrs);


    /**
     * @attribute map
     * @type {aeris.maps.Map}
     */
    BaseModel.call(this, attrs, opt_options);

    /**
     * Triggered when a map is set.
     *
     * @event map:set
     * @param {aeris.maps.extensions.MapExtensionObject} model
     * @param {aeris.maps.Map} map
     * @param {Object} options
     */
    /**
     * Triggered when a map is removed.
     *
     * @event map:remove
     * @param {aeris.maps.extensions.MapExtensionObject} model
     * @param {null} map
     * @param {Object} options
     */
    this.listenTo(this, {
      'change:map': function(model, map, options) {
        var topic = (map === null) ? 'map:remove' : 'map:set';
        this.trigger(topic, model, map, options);
      }
    });
  };
  _.inherits(State, BaseModel);


  State.prototype.normalize_ = function(attrs) {
    _.each(attrs, function(value, key) {

      // Value is a Model/Collection
      // --> Bubble change events
      if (
        value instanceof Collection ||
        value instanceof BaseModel
      ) {
        // Remove any events bound to previous collection
        if (this.get(key) && this.get(key).listenTo) {  // Sniff event obj
          this.stopListening(this.get(key));
        }

        // Bind change events for child models/collection
        this.listenTo(value, 'add remove change reset', function() {
          this.trigger('change', this);
          this.trigger('change:' + key, this, this.get(key));
        });
      }

      // Value is raw data for
      // and existing Model/Collection
      // --> set raw data on collection
      else if (
        (this.get(key) instanceof Collection && _.isArray(value)) ||
        (this.get(key) instanceof BaseModel && _.isObject(value))
      ) {
        this.get(key).set(value);

        // Remove attribute,
        // as we're done setting it.
        delete attrs[key];
      }
    }, this);

    return attrs;
  };

  /**
   * @method getMap
   */
  State.prototype.getMap = function() {
    return this.get('map');
  };


  /**
   * @method setMap
   */
  State.prototype.setMap = function(map) {
    this.set('map', map);
  };


  /**
   * @return {Boolean} Returns false if map attribute is null.
   * @method hasMap
   */
  State.prototype.hasMap = function() {
    return _.isNull(this.get('map'));
  };


  State.prototype.toJSON = function() {
    var json = {};

    // A safe version of our attributes
    var attrs = _.clone(this.attributes);

    // Remove attributes which don't get serialized
    attrs = _.omit(attrs, 'map');

    _.each(attrs, function(value, key) {
      // JSON-ify nested collections
      if (value instanceof MapObjectToggleCollection) {
        json[key] = value.toJSON();
      }
      else {
        json[key] = value;
      }
    }, this);

    return json;
  };


  return State;
});
