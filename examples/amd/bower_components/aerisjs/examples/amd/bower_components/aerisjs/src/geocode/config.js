define([
  'aeris/util',
  'aeris/model',
  'module'
], function(_, Model, module) {
  return new Model(module.config());
});
