define([
  'module',
  // Using backbone instead of aeris/model,
  // Because aeris/util is going to pull this in,
  // and aeris/model uses aeris/util.
  //
  // And we wouldn't want a circular dependency, now,
  // would we?
  'vendor/backbone'
], function(module, Backbone) {
  // Start with any config values
  // passed in with require.config
  return new Backbone.Model(module.config());
});
