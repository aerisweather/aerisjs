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
    error = (error instanceof ValidationError) ? error : new ValidationError(error);
    throw error;
  };


  return Model;
});
