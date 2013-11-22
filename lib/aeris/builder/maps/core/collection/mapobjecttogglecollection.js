define([
  'aeris/util',
  'application/form/collection/togglecollection',
  'mapbuilder/core/model/mapobjecttoggle'
], function(_, ToggleCollection, MapObjectToggle) {
  /**
   * A collection of {aeris.builder.maps.core.model.MapObjectToggle} models.
   *
   * @class aeris.builder.maps.core.collection.MapObjectToggleCollection
   * @extends aeris.application.form.collection.ToggleCollection
   *
   * @constructor
   */
  var MapObjectToggleCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: MapObjectToggle
    });

    ToggleCollection.call(this, opt_models, options);
  };
  _.inherits(MapObjectToggleCollection, ToggleCollection);


  /**
   * Remove a {aeris.builder.maps.core.model.MapObjectToggle} model
   * by it's `name` attribute
   *
   * @param {string} name
   * @param {Object=} opt_options see Backbone.Collection#remove options.
   */
  MapObjectToggleCollection.prototype.removeByName = function(name, opt_options) {
    var toRemove = this.get(name);
    this.remove(toRemove, opt_options);
  };


  return MapObjectToggleCollection;
});
