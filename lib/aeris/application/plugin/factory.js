define([
  'aeris/util'
], function(_) {
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


  return function (pluginOptions) {
    return {
      factories: {
        factory: function (resolver, componentDef, wire) {
          var classFactorySpec = convertToCreateFactorySpec(componentDef.options);

          wire(classFactorySpec).
            then(resolver.resolve, resolver.reject);
        }
      }
    }
  };
});
