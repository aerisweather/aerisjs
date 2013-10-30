define([
  'aeris/util',
  'aeris/collection',
  'mapbuilder/core/model/mapobjectstate'
], function(_, Collection, MapObjectState) {
  /**
   * A collection of {aeris.builder.maps.core.model.MapObjectState} models.
   *
   * @class aeris.builder.maps.core.collection.MapObjectStateCollection
   * @extends aeris.Collection
   *
   * @constructor
   */
  var MapObjectStateCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: MapObjectState
    });

    /**
     * @override
     * @type {aeris.builder.maps.core.model.MapObjectState}
     */
    this.model = options.model;

    Collection.call(this, opt_models, options);
  };
  _.inherits(MapObjectStateCollection, Collection);


  /**
   * Remove a {aeris.builder.maps.core.model.MapObjectState} model
   * by it's `name` attribute
   *
   * @param {string} name
   * @param {Object=} opt_options see Backbone.Collection#remove options.
   */
  MapObjectStateCollection.prototype.removeByName = function(name, opt_options) {
    var toRemove = this.where({ name: name });
    this.remove(toRemove, opt_options);
  };


  return MapObjectStateCollection;
});
