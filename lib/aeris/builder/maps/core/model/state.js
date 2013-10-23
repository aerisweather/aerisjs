define([
  'aeris/util',
  'aeris/model',
  'mapbuilder/core/vent',
  'mapbuilder/core/collection/mapobjectstatecollection'
], function(_, BaseModel, vent, MapObjectStateCollection) {
  /**
   * The common state of the builder application.
   *
   * The state information held by this object
   * is limited to data which is common between all
   * application modules.
   *
   * @class aeris.builder.maps.core.model.State
   * @extends aeris.Model
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
     * @event 'map:set'
     * @param {aeris.maps.extensions.MapExtensionObject} model
     * @param {aeris.maps.Map} map
     * @param {Object} options
     */
    /**
     * Triggered when a map is removed.
     *
     * @event 'map:remove'
     * @param {aeris.maps.extensions.MapExtensionObject} model
     * @param {null} map
     * @param {Object} options
     */
    this.listenTo(this, {
      'change:map': function(model, map, options) {
        var topic = (map === null) ? 'map:remove' : 'map:set';
        this.trigger(topic, model, map, options);
        vent.trigger(topic, map);
      }
    });
  };
  _.inherits(State, BaseModel);



  State.prototype.set = function(config, val, options) {
    var attrs;

    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (typeof config === 'object') {
      attrs = config;
      options = val;
    } else {
      (attrs = {})[config] = val;
    }

    _.each(attrs, function(value, key) {
      // Registering a new nested collection
      // --> Bind change events
      if (value instanceof MapObjectStateCollection) {
        // Clear existing events
        if (this.get(key) instanceof MapObjectStateCollection) {
          this.stopListening(this.get(key));
        }

        // Bind events for child collections
        this.listenTo(value, 'add remove change reset', function() {
          this.trigger('change', this, options);
          this.trigger('change:' + key, this, this.get(key));
        });

        BaseModel.prototype.set.call(this, key, value);
      }

      // Updating a registered nested collection
      else if (this.get(key) instanceof MapObjectStateCollection) {
        // Set value of nested collection
        this.get(key).set(value);
      }

      // Regular life
      else {
        // Set as normal
        BaseModel.prototype.set.call(this, key, value, options);
      }


    }, this);

  };


  /**
   * @return {Boolean} Returns false if map attribute is null.
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
      if (value instanceof MapObjectStateCollection) {
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
