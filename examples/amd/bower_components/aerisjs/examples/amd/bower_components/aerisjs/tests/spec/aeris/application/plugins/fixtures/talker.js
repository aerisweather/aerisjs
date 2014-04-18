define([
  'backbone',
  'underscore'
], function(Backbone, _) {
  var Talker = function() {
  };
  _.extend(Talker.prototype, Backbone.Events);

  return Talker;
})