define([
  'application/plugin/helper/specextender'
], function (SpecExtender) {
  return function (pluginOptions) {
    return {
      factories: {
        /**
         * Extend factory plugin.
         *
         * Creates a components from multiple spec modules.
         *
         * Example:
         *
         *  define('SpecA', {
         *    foo: 'bar',
         *    hello: 'world'
         *  });
         *
         *  define('SpecB', {
         *    hello: 'everybody',
         *    yo: 'Jo'
         *  });
         *
         *  wire({
         *    myCombinedSpec: {
         *      extend: [
         *        'SpecA',
         *        'SpecB'
         *      ]
         *    }
         *  }).then(function(ctx) {
         *    ctx.combined.foo === 'bar';          // true
         *    ctx.combined.hello === 'everybody';  // true
         *    ctx.combined.yo === 'jo';            // true
         *  });;
         */
        extend: function (resolver, componentDef, wire) {
          var specModulesToExtend = componentDef.options;
          var extender = new SpecExtender(wire);

          extender.extendSpecModules(specModulesToExtend).
            then(wire).
            then(resolver.resolve, resolver.reject);
        }
      }
    };
  };
});
