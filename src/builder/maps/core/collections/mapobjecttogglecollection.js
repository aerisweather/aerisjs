define([
  'aeris/util',
  'aeris/application/forms/collections/togglecollection',
  'aeris/builder/maps/core/models/mapobjecttoggle'
], function(_, ToggleCollection, MapObjectToggle) {
  /**
   * A collection of {aeris.builder.maps.core.models.MapObjectToggle} models.
   *
   * @class MapObjectToggleCollection
   * @namespace aeris.builder.maps.core.collections
   * @extends aeris.application.forms.collections.ToggleCollection
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
   * Remove a {aeris.builder.maps.core.models.MapObjectToggle} model
   * by it's `name` attribute
   *
   * @param {string} name
   * @param {Object=} opt_options see Backbone.Collection#remove options.
   * @method removeByName
   */
  MapObjectToggleCollection.prototype.removeByName = function(name, opt_options) {
    var toRemove = this.get(name);
    this.remove(toRemove, opt_options);
  };


  return MapObjectToggleCollection;
});
