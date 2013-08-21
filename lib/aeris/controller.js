define([
  'vendor/backbone',
  '../vendor/jquery',
  'aeris/events',
  'aeris/util',
  'vendor/backbone.view.ext'
], function(Backbone, $, Events, _) {
  /**
   * Base Controller class
   *
   * @class
   * @constructor
   * @see http://backbonejs.org/#View
   * @extends {Backbone.View}
   */
  var Controller = function(opt_options) {
      Events.call(this);

      Backbone.View.apply(this, arguments);
  };

  // Inherit Backbone.View
  _.inherits(Controller, Backbone.View);

  // Mixin Aeris Events class
  _.extend(Controller.prototype, Events.prototype);

  return Controller;
});
