/**
 * @fileoverview Defines a package of custom jasmine matchers.
*/
require.config({
  shim: {
    'matchers/jasmine-context': {
      deps: ['jasmine']
    }
  }
});
require([
  'matchers/custom-matchers',
  'matchers/jasmine-context'
]);
