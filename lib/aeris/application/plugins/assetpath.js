define(['aeris/config'], function(aerisConfig) {
  return function() {
    return {
      resolvers: {
        assetPath: function(resolver, refName, refObj, wire) {
          var assetsBasePath = aerisConfig.get('path') + 'assets/';
          var path = assetsBasePath + refName;

          resolver.resolve(path);
        }
      }
    }
  }
});
