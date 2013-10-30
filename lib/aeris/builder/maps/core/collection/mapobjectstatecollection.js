define([
  'aeris/util',
  'application/form/collection/togglecollection',
  'mapbuilder/core/model/mapobjectstate'
], function(_, ToggleCollection, MapObjectState) {
  /**
   * A collection of {aeris.builder.maps.core.model.MapObjectState} models.
   *
   * @class aeris.builder.maps.core.collection.MapObjectStateCollection
   * @extends aeris.application.form.collection.ToggleCollection
   *
   * @constructor
   */
  var MapObjectStateCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: MapObjectState
    });

    ToggleCollection.call(this, opt_models, options);
  };
  _.inherits(MapObjectStateCollection, ToggleCollection);


  /**
   * Remove a {aeris.builder.maps.core.model.MapObjectState} model
   * by it's `name` attribute
   *
   * @param {string} name
   * @param {Object=} opt_options see Backbone.Collection#remove options.
   */
  MapObjectStateCollection.prototype.removeByName = function(name, opt_options) {
    var toRemove = this.get(name);
    this.remove(toRemove, opt_options);
  };


  return MapObjectStateCollection;
});
