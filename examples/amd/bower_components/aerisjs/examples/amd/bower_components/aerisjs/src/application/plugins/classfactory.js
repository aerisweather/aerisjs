define([
  'aeris/classfactory'    // Require module for rjs build.
], function() {
  function convertToCreateFactorySpec(spec) {
    return {
      create: {
        module: 'aeris/classfactory',
        args: [
          { module: spec.module },
          spec.args,
          { extendArgObjects: true }
        ]
      }
    };
  }


  return function(pluginOptions) {
    return {
      factories: {
        ClassFactory: function(resolver, componentDef, wire) {
          var classFactorySpec = convertToCreateFactorySpec(componentDef.options);

          wire(classFactorySpec).
            then(resolver.resolve, resolver.reject);
        }
      }
    };
  };
});
