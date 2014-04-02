define([
  'aeris/config'
], function(aerisConfig) {
  function validateConfigAttr(attr) {
    var NO_ERROR = void 0;

    if (!aerisConfig.has(attr)) {
      return new Error('aeris config has no attribute \'' + attr + '\'');
    }

    return NO_ERROR;
  }


  return function(pluginOptions) {
    return {
      resolvers: {
        aerisConfig: function(resolver, refName, refObj, wire) {
          var configHasNoAttrError = validateConfigAttr(refName);

          if (configHasNoAttrError) {
            resolver.reject(configHasNoAttrError);
            return;
          }

          resolver.resolve(aerisConfig.get(refName));
        }
      }
    };
  };
});
