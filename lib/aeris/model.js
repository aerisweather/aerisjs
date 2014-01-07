define([
  'aeris/util',
  'vendor/backbone',
  'aeris/events',
  'aeris/errors/validationerror',
  'aeris/errors/invalidargumenterror'
], function(_, Backbone, Events, ValidationError, InvalidArgumentError) {
  /**
   * The base model class for Aeris JS Libraries
   *
   * See http://backbonejs.org/#Model for documentation
   *
   * @constructor
   *
   * @param {Object=} opt_attrs
   *
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.validate
   *        If set to true, model will immediately check validation
   *        on instantiation.
   *
   * @class aeris.Model
   * @extends Backbone.Model
   * @mixes aeris.Events
   */
  var Model = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      validate: false
    });

    // We don't want ctor to validate before we
    // have bound validation error handlers
    var parentCtorOptions = _.omit(options, 'validate');


    /**
     * See Backbone.Model#idAttribute.
     *
     * @override
     */
    this.idAttribute = options.idAttribute || 'id';


    /**
     * Default attributes
     *
     * @override
     */
    this.defaults = this.defaults || options.defaults;


    /**
     * The options used when constructing
     * the model.
     *
     * @type {Object}
     * @private
     */
    this.options_ = opt_options || {};


    Backbone.Model.call(this, opt_attrs, parentCtorOptions);
    Events.call(this);

    // Handle validation errors
    this.on('invalid', this.onValidationError_, this);

    if (options.validate) {
      this.isValid();
    }

  };
  _.inherits(Model, Backbone.Model);
  _.extend(Model.prototype, Events.prototype);


  /**
   * Handle 'invalid' events thrown by the model.
   *
   * @param {aeris.Model} model
   * @param {aeris.errors.ValidationError} error
   * @private
   */
  Model.prototype.onValidationError_ = function(model, error) {
    error = (error instanceof Error) ? error : new ValidationError(error);
    throw error;
  };


  /**
   * Normalize attributes before setting
   *
   * @param {Object} config
   * @protected
   */
  Model.prototype.set = function(key, value, opts) {
    var config

    // Convert args to { key: value } format
    if (_.isString(key)) {
      (config = {})[key] = value;
    }
    else {
      config = key;

      // Options are the second argument
      opts = value;
    }

    // Normalize config before setting
    config = this.normalize_(config);

    if (!config) {
      throw Error('Invalid model attributes. ' +
        'Make sure that Model#normalize_ is returning an object.');
    }

    Backbone.Model.prototype.set.call(this, config, opts);
  };


  /**
   * This method is called every time attributes
   * are set on the model.
   *
   * Override to provide any additional processing
   * needed for options object structure, etc.
   *
   * @param {Object} attrs
   * @return {attrs} Normalized attrs.
   *
   * @protected
   */
  Model.prototype.normalize_ = function(attrs) {
    return attrs;
  };


  /**
   * Returns a deep-nested property
   * of a model attribute.
   *
   * Example:
   *    model.set('deepObj', {
   *      levelA: {
   *        levelB: {
   *          foo: 'bar'
   *        }
   *      }
   *    });
   *
   *    model.getAtPath('deepObj.levelA.levelB.foo');      // 'bar'
   *
   * Returns undefined if the path cannot be resolved.
   *
   * @param {string} path
   * @return {*|undefined}
   */
  Model.prototype.getAtPath = function(path) {
    var pathParts = path.split('.');
    var attrName = pathParts.splice(0, 1)[0];
    var attrObj = this.get(attrName);

    return pathParts.length ? _.path(pathParts.join('.'), attrObj) : attrObj;
  };


  /**
   * Create a copy of the model
   * using the Type constructor provided.
   *
   * Clone will be constructed with model's current
   * attributes, and the options the model was constructed
   * with.
   *
   * @param {Function} Type aeris.Model constructor
   * @return {aeris.Model}
   */
  Model.prototype.cloneUsingType = function(Type) {
    var attributesCopy = _.clone(this.attributes);
    var optionsCopy = _.clone(this.options_);

    var clone = new Type(attributesCopy, optionsCopy);

    var isTypeModel = clone instanceof Model;
    if (!isTypeModel) {
      throw new InvalidArgumentError('Unable to clone model: invalid Type constructor provided');
    }

    return clone;
  };


  /**
   * DO NOT USE
   *
   * Model#clone is not support by {aeris.Model}.
   *
   * Definition is provided only to override
   * Backbone.Model definition. Backbone's `clone` method
   * cannot be used, because aeris does not use the same
   * logic for extending classes.
   *
   * @override
   */
  Model.prototype.clone = function() {
    throw new TypeError('Object ' + this + ' has no method \'clone\'. ' +
      'Try using cloneUsingType instead.');
  };


  return Model;
});
