define([
  'aeris/util',
  'aeris/model',
  'aeris/events',
  'backbone',
  'aeris/errors/invalidargumenterror'
], function(_, Model, Events, Backbone, InvalidArgumentError) {
  /**
   * Base collection class.
   *
   * @class Collection
   * @namespace aeris
   * @extends Backbone.Collection
   *
   * @param {Array.<aeris.Model>=} opt_models
   * @param {Object} opt_options
   * @param {Boolean=} opt_options.validate
   *        If set to true, will validate all models on instantiation.
   * @constructor
   */
  var Collection = function(opt_models, opt_options) {
    var options = _.extend({
      model: Model,
      validate: false,
      modelOptions: {}
    }, opt_options);

    if (opt_models && !_.isArray(opt_models)) {
      throw new InvalidArgumentError(opt_models + ' is not a valid array of models.');
    }


    /**
     * Options to pass on to
     * models created by this collection.
     *
     * @type {Object}
     * @protected
     * @property modelOptions_
     */
    this.modelOptions_ = options.modelOptions;


    Backbone.Collection.call(this, opt_models, options);
    Events.call(this);

    if (options.validate) {
      this.isValid();
    }


    /**
     * When any child model's attribute changes
     * @event change
     * @param {aeris.Model} model
     */

    /**
     * When any child model's attribute changes,
     * where [attribute] is the name of the attribute.
     *
     * @event change:[attribute]
     * @param {aeris.Model} model
     * @param {*} value
     */

    /**
     * When a model is added to the
     * {aeris.Collection}.
     *
     * @event add
     * @param {aeris.Model} model
     * @param {aeris.Collection} collection
     */

    /**
     * When a model is removed from the {aeris.Collection}.
     *
     * @event remove
     * @param {aeris.Model} model
     * @param {aeris.Collection} collection
     */
  };
  _.inherits(Collection, Backbone.Collection);
  _.extend(Collection.prototype, Events.prototype);


  /**
   * Runs validation on all collection models.
   *
   * @return {Boolean=} Returns false if any model fails validation.
   * @method isValid
   */
  Collection.prototype.isValid = function() {
    var isValid = true;
    this.each(function(model) {
      if (!model.isValid()) {
        isValid = false;
      }
    });

    return isValid;
  };

  /**
   * Retrieve a model from the collection
   * by id.
   *
   * @param {number|string} id
   * @return {aeris.Model}
   */

  /**
   * Retrieve a model from the collection
   * by index.
   *
   * @method at
   * @param {number} index
   * @return {aeris.Model}
   */

  /**
   * Pass modelOptions on to newly
   * created models.
   *
   * @override
   * @private
   * @method _prepareModel
   */
  Collection.prototype._prepareModel = function(attrs, opt_options) {
    var options = _.defaults(opt_options || {}, this.modelOptions_);

    return Backbone.Collection.prototype._prepareModel.call(this, attrs, options);
  };


  return _.expose(Collection, 'aeris.Collection');
});

/**
 * See http://backbonejs.org/#Collection for full
 * documentation. Provided here to provide documentation
 * for extending classes.
 *
 * @class Collection
 * @namespace Backbone
 */

/**
 * @protected
 * @method _prepareModel
 */

/**
 * @property model
 * @type {Function}
*/

/**
 * Add models to the collection.
 *
 * @method add
 * @param {Array.<Backbone.Model|Object>} models
 */

/**
 * Remove models from the collection.
 *
 * @method remove
 * @param {Array.<Backbone.Model>} models
 */

/**
 * Remove and replace all models in the collection.
 *
 * @method reset
 * @param {Array.<Backbone.Model|Object>=} opt_models
 */

/**
 * @protected
 * @method set
 */

/**
 * @method push
 * @protected
 */

/**
 * @method pop
 * @protected
 */

/**
 * @method shift
 * @protected
 */

/**
 * @method slice
 * @protected
 */

/**
 * The number of models in the collection.
 *
 * @property length
 */

/**
 * @protected
 * @method parse
 */
