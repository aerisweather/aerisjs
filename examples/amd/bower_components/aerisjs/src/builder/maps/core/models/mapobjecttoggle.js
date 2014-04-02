define([
  'aeris/util',
  'aeris/collection',
  'aeris/model',
  'aeris/application/forms/models/toggle'
], function(_, Collection, Model, Toggle) {
  /**
   * The state of a {aeris.maps.extensions.MapExtensionObject}
   * within the application.
   *
   * @class MapObjectToggle
   * @namespace aeris.builder.maps.core.models
   * @extends aeris.application.forms.models.Toggle
   *
   * @constructor
   * @override
   */
  var MapObjectToggle = function(opt_attrs, opt_options) {
    /**
     * A unique reference to the toggle object.
     *
     * @attribute type
     * @type {string}
     */
    /**
     * The class name of the associated MapObject
     * within the global namespace.
     *
     * @attribute class
     * @type {string}
     */

    var options = _.defaults(opt_options || {}, {
      namespace: 'aeris.maps',
      idAttribute: 'type'
    });


    /**
     * The namespace in which to find
     * the named MapExtensionObject
     *
     * @type {string}
     * @property namespace_
     */
    this.namespace_ = options.namespace;


    Toggle.call(this, opt_attrs, options);

    // Force validate
    this.listenTo(this, 'all', function() {
      this.isValid();
    });
  };
  _.inherits(MapObjectToggle, Toggle);


  /**
   * Uses the class attribute to find
   * the MapObject constructor.
   *
   * If no class attribute is provided,
   * uses the name attribute instead.
   *
   *
   * @return {Function} The constructor for the {aeris.maps.extensions.MapObjectInterface}
   *                    associated with this model.
   * @method getMapObject
   */
  MapObjectToggle.prototype.getMapObject = function() {
    var ctor;
    var mapObjectNS = _.isString(this.namespace_) ? _.path(this.namespace_) : this.namespace_;

    var fail = _.bind(function() {
      throw new Error('Unable to find a map object with name ' +
        '\'' + this.get('class') + '\'' +
        ' within the \'' + this.namespace_ + '\' namespace');
    }, this);

    try {
      ctor = mapObjectNS[this.get('class')];
    }
    catch (e) {
      fail();
    }

    if (!_.isFunction(ctor)) {
      fail();
    }

    return ctor;
  };


  MapObjectToggle.prototype.normalize_ = function(attrs) {
    attrs = Toggle.prototype.normalize_.call(this, attrs);

    _.each(attrs, function(value, key) {
      // Updating existing model/collection
      if (
        this.get(key) instanceof Collection ||
          this.get(key) instanceof Model
        ) {
        this.get(key).set(value);
        delete attrs[key];
      }
    }, this);

    return attrs;
  };


  return MapObjectToggle;
});
