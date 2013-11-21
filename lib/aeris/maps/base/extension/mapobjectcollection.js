define([
  'aeris/util',
  'aeris/viewcollection'
], function(_, ViewCollection) {
  /**
   * A collection of {aeris.maps.MapObjectInterface} objects.
   * 
   * @class aeris.maps.extension.MapObjectCollection
   * @extends aeris.ViewCollection
   * 
   * @implements aeris.maps.MapObjectInterface
   *
   * @constructor
   * @override
  */
  var MapObjectCollection = function() {
    ViewCollection.apply(this, arguments);
  };
  _.inherits(MapObjectCollection, ViewCollection);


  /**
   * Set the map on all child MapObjects.
   *
   * Any newly created map objects will be
   * instantiated with the map set here.
   *
   * @override
   */
  MapObjectCollection.prototype.setMap = function(map) {
    var topic = map ? 'map:set' : 'map:remove';

    this.map_ = map;

    this.invoke('setMap', map);

    this.trigger(topic, this, map);
  };


  /**
   * @override
   */
  MapObjectCollection.prototype.getMap = function() {
    return this.map_;
  };


  /**
   * @override
   * @returns {boolean}
   */
  MapObjectCollection.prototype.hasMap = function() {
    return !!this.map_;
  };


  /**
   * Create child models with the
   * collection's map.
   *
   * @override Overrides Backbone.Model#_prepareModel
   */
  MapObjectCollection.prototype._prepareModel = function(opt_attrs, opt_options) {
    var attrs = opt_attrs || {};

    attrs.map = this.map_;

    return ViewCollection.prototype._prepareModel.call(this, attrs,  opt_options);
  };
  
  
  return MapObjectCollection;
});
