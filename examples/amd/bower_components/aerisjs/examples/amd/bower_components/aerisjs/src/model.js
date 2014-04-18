define([
  'aeris/util',
  'backbone',
  'aeris/events',
  'aeris/errors/validationerror'
], function(_, Backbone, Events, ValidationError) {
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
   * @class Model
   * @namespace aeris
   * @extends Backbone.Model
   * @uses aeris.Events
   */
  var Model = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      validate: false
    });

    // We don't want ctor to validate before we
    // have bound validation error handlers
    var parentCtorOptions = _.omit(options, 'validate');


    /**
     * @property idAttribute
     */
    this.idAttribute = options.idAttribute || 'id';


    /**
     * @property defaults
     */
    this.defaults = this.defaults || options.defaults;


    /**
     * The options used when constructing
     * the model.
     *
     * @type {Object}
     * @private
     * @property options_
     */
    this.options_ = opt_options || {};


    Backbone.Model.call(this, opt_attrs, parentCtorOptions);
    Events.call(this);

    // Handle validation errors
    this.on('invalid', this.onValidationError_, this);

    if (options.validate) {
      this.isValid();
    }



    /**
     * When a model's attribute changes
     * @event change
     * @param {aeris.Model} model
     */

    /**
     * When a model's attribute changes,
     * where [attribute] is the name of the attribute.
     *
     * @event change:[attribute]
     * @param {aeris.Model} model
     * @param {*} value
     */

    /**
     * When a model is added to a
     * {aeris.Collection}.
     *
     * @event add
     * @param {aeris.Model} model
     * @param {aeris.Collection} collection
     */

    /**
     * When a model is removed from a {aeris.Collection}.
     *
     * @event remove
     * @param {aeris.Model} model
     * @param {aeris.Collection} collection
     */

  };
  _.inherits(Model, Backbone.Model);
  _.extend(Model.prototype, Events.prototype);


  /**
   * Handle 'invalid' events thrown by the model.
   *
   * @param {aeris.Model} model
   * @param {aeris.errors.ValidationError} error
   * @private
   * @method onValidationError_
   */
  Model.prototype.onValidationError_ = function(model, error) {
    error = (error instanceof Error) ? error : new ValidationError(error);
    throw error;
  };

  /**
   * Validate the model's attributes.
   *
   * @override
   * @method isValid
   * @throws {aeris.errors.ValidationError}
   */


  /**
   * Normalize attributes before setting
   *
   * @param {Object} config
   * @protected
   * @method set
   */
  Model.prototype.set = function(key, value, opts) {
    var config;

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
   * @method normalize_
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
   * @method getAtPath
   */
  Model.prototype.getAtPath = function(path) {
    var pathParts = path.split('.');
    var attrName = pathParts.splice(0, 1)[0];
    var attrObj = this.get(attrName);

    return pathParts.length ? _.path(pathParts.join('.'), attrObj) : attrObj;
  };


  /**
   * Create a copy of the model.
   *
   * @method clone
   * @param {Object=} opt_attrs Attributes to set on the cloned model.
   * @param {Object=} opt_options Options to pass to cloned mode.
   * @return {aeris.Model}
   */
  Model.prototype.clone = function(opt_attrs, opt_options) {
    var attributes = _.extend({}, this.attributes, opt_attrs);
    var options = _.extend({}, this.options_, opt_options);

    return new this.constructor(attributes, options);
  };


  return Model;
});
/**
 * See http://backbonejs.org/ for full documentation.
 * Included here to provide documentation for
 * inherited aeris.Model classes
 *
 * @class Model
 * @namespace Backbone
 *
 * @param {Object=} opt_attrs Attributes to set on the model.
 *
 * @param {Object=} opt_options
 * @param {Backbone.Collection=} opt_options.collection
 * @param {Boolean=} opt_options.parse
 */

/**
 * @method get
 * @protected
 *
 * @param {string} attribute
 * @return {*}
 */

/**
 * @method set
 * @protected
 *
 * @param {Object|string} attributes
 * @param {Object|*=} opt_options
 * @param {Boolean=} opt_options
 */

/**
 * @protected
 * @method has
 * @return {Boolean}
*/

/**
 * @param {string} attribute
 * @protected
 * @method unset
*/

/**
 * @protected
 * @method
*/

/**
 * @protected
 * @property idAttribute
 * @type {string}
*/

/**
 * @protected
 * @property id
 * @type {number|string}
*/

/**
 * @protected
 * @property cid
 * @type {number|string}
*/

/**
 * @protected
 * @property attributes
 * @type {Object}
*/

/**
 * @protected
 * @property defaults
 * @type {Object}
 */

/**
 * @method toJSON
 * @return {Object} A shallow copy of the model's attributes.
 */

/**
 * @protected
 * @method sync
 * @param {string} method
 * @param {Backbone.Model} model
 * @param {Object=} options
 */

/**
 * Fetch model data.
 *
 * @method fetch
*/

/**
 * @method validate
 * @protected
*/

/**
 * @method parse
 * @protected
*/

/**
 * @method sync
 * @protected
*/
