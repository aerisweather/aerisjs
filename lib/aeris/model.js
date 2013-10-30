define([
  'aeris/util',
  'vendor/backbone',
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
   * @class aeris.Model
   * @extends Backbone.Model
   * @mixes aeris.Events
   */
  var Model = function(opt_attrs, opt_options) {
    var options = _.extend({
      validate: false
    }, opt_options);


    /**
     * See Backbone.Model#idAttribute.
     *
     * @override
     */
    this.idAttribute = options.idAttribute;


    Backbone.Model.call(this, opt_attrs, options);
    Events.call(this);

    // Handle validation errors
    this.on('invalid', this.onValidationError_, this);

    // Run validation
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


  return Model;
});
