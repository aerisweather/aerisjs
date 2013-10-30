define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/validationerror'
], function(_, Model, ValidationError) {
  /**
   * The state of a {aeris.maps.extension.MapExtensionObject}
   * within the application.
   *
   * @class aeris.builder.maps.core.model.MapObjectState
   * @extends aeris.Model
   *
   * @constructor
   * @override
   */
  var MapObjectState = function(opt_attrs, opt_options) {
    /**
     * Name of a {aeris.maps.extension.MapExtensionObject}
     * class, as referenced within the global aeris namespace.
     *
     * @attribute name
     * @type {string}
     */

    var options = _.defaults(opt_options || {}, {
      namespace: 'aeris.maps',
      idAttribute: 'name'
    });


    /**
     * The namespace in which to find
     * the named MapExtensionObject
     *
     * @type {string}
     */
    this.namespace_ = options.namespace;

    /**
     * Set unique attr key.
     *
     * @override
     * @type {string}
     */
    this.idAttribute = options.idAttribute;


    Model.call(this, opt_attrs, options);

    // Force validate
    this.listenTo(this, 'all', function() {
      this.isValid();
    });
  };
  _.inherits(MapObjectState, Model);


  /**
   * @override
   */
  MapObjectState.prototype.validate = function(attrs) {
    if (!_.isString(attrs.name)) {
      return new ValidationError('name', attrs.name + ' is not a valid name');
    }
  };


  /**
   * @return {Function} The constructor for the MapExtensionObject
   *                    associated with this model.
   */
  MapObjectState.prototype.getMapObject = function() {
    var ctor;
    var mapObjectNS = _.isString(this.namespace_) ? _.path(this.namespace_) : this.namespace_;

    var fail = _.bind(function() {
      throw new Error('Unable to find a map object with name ' +
        '\'' + this.get('name') + '\'' +
        ' within the \'' + this.namespace_ + '\' namespace');
    }, this);

    try {
      ctor = mapObjectNS[this.get('name')];
    }
    catch (e) {
      fail();
    }

    if (!_.isFunction(ctor)) {
      fail();
    }

    return ctor;
  };


  return MapObjectState;
});
