define([
  'aeris/util',
  'vendor/backbone',
  'aeris/events'
], function(_, Backbone, Events) {
  /**
   * The base model class for Aeris JS Libraries
   *
   * See http://backbonejs.org/#Model for documentation
   *
   * @constructor
   * @class aeris.Model
   * @extends Backbone.Model
   * @mixes aeris.Events
   */
  var Model = function() {
    Backbone.Model.apply(this, arguments);
    Events.call(this);
  };

  _.inherits(Model, Backbone.Model);
  _.extend(Model.prototype, Events.prototype);


  return Model;
});
