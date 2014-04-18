define(['aeris/config'], function(aerisConfig) {
  return function() {
    return {
      resolvers: {
        assetPath: function(resolver, refName, refObj, wire) {
          var path = aerisConfig.get('assetPath') + refName;

          resolver.resolve(path);
        }
      }
    };
  }
});
