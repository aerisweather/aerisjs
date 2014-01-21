define([
  'ai/util',
  'ai/model',
  'module'
], function(_, Model, module) {
  return new Model(module.config());
});
