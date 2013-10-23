define([
  'aeris/util',
  'aeris/simplecollection'
], function(_, SimpleCollection) {
  /**
   * A simple collection of map objects,
   * referenced by strings corresponding to their names within the
   * global aeris namespace.
   *
   * @class aeris.builder.maps.core.collection.MapObjectStateCollection
   * @extends aeris.SimpleCollection
   *
   * @constructor
   */
  var MapObjectStateCollection = function(opt_models, opt_options) {
    SimpleCollection.call(this, opt_models, opt_options);
  };
  _.inherits(MapObjectStateCollection, SimpleCollection);


  return MapObjectStateCollection;
});
