define([
  'aeris/errors/invalidargumenterror',
  'marionette'
], function(InvalidArugmentErrors, Marionette) {
  /**
   * A WireJS resolver plugin,
   * which returns a region by name,
   * within a given layout.
   *
   * eg.
   *
   *    someRegionObj: {
   *      $ref: 'region!someRegion',
   *      layout: { $ref: 'someLayout' }
   *    }
   *
   *    Will return a reference to the someLayout.someRegion
   *   {Marionette.Region} instance belonging to the
   *    `someLayout` {Marionette.Layout}.
   *
   * @class RegionResolver
   * @namespace aeris.application.plugin
   */
  function regionResolver(pluginPromise, regionName, refObj, wire) {
    var layoutSpec = refObj.layout;

    wire(layoutSpec).
      then(
        function(layout) {
          var region = getNamedRegion(regionName, layout);
          pluginPromise.resolve(region);
        },
        function(e) {
          throw e;
        }
      ).
      otherwise(function(e) {
        pluginPromise.reject(e);
      });
  }

  function getNamedRegion(regionName, layout) {
    if (!(layout instanceof Marionette.Layout)) {
      throw new InvalidArugmentErrors('Unable to resolve region: ' +
        layout + ' is not a valid Marionette.Layout instance');
    }
    if (!(layout[regionName] instanceof Marionette.Region)) {
      throw new InvalidArugmentErrors('Unable to resolve region: ' +
        ' No region with the name \'' + regionName + '\' exists within' +
        ' the specified layout');
    }

    return layout[regionName];
  }

  return function(pluginOptions) {
    return {
      resolvers: {
        region: regionResolver
      }
    };
  };
});
