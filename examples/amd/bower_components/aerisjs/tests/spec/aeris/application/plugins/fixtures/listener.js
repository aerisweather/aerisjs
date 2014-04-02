define([
  'underscore',
  'backbone',
  'jasmine'
], function(_, Backbone, jasmine) {
  var Listener = function() {
    this.listen = jasmine.createSpy('Listener#listen');
    this.listenClosely = jasmine.createSpy('Listener#listenHard');
  };
  _.extend(Listener.prototype, Backbone.Events);


  return Listener;
});
