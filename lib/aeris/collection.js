define([
  'aeris/util',
  'aeris/events',
  'vendor/backbone'
], function(_, Events, Backbone) {
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
      validate: false
    }, opt_options);

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


  return _.expose(Collection, 'aeris.Collection');
});
