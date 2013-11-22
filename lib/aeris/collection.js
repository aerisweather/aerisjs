define([
  'aeris/util',
  'aeris/model',
  'aeris/events',
  'vendor/backbone'
], function(_, Model, Events, Backbone) {
  /**
   * Base collection class.
   *
   * @class aeris.Collection
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


    /**
     * Options to pass on to
     * models created by this collection.
     *
     * @type {Object}
     * @protected
     */
    this.modelOptions_ = options.modelOptions;


    Backbone.Collection.call(this, opt_models, options);
    Events.call(this);

    if (options.validate) {
      this.isValid();
    }
  };
  _.inherits(Collection, Backbone.Collection);
  _.extend(Collection.prototype, Events.prototype);


  /**
   * Runs validation on all collection models.
   *
   * @return {Boolean=} Returns false if any model fails validation.
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
   * Pass modelOptions on to newly
   * created models.
   *
   * @override
   */
  Collection.prototype._prepareModel = function(attrs, opt_options) {
    var options = _.defaults(opt_options || {}, this.modelOptions_);

    return Backbone.Collection.prototype._prepareModel.call(this, attrs, options);
  };


  return _.expose(Collection, 'aeris.Collection');
});
