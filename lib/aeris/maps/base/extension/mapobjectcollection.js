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

    this.bindChildrenToMap_();
  };
  _.inherits(MapObjectCollection, ViewCollection);


  MapObjectCollection.prototype.bindChildrenToMap_ = function() {
    this.listenTo(this, {
      add: function(model) {
        model.setMap(this.map_);
      },
      remove: function(model) {
        model.setMap(null);
      }
    });
  };


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
    var isSameMapAsCurrentlySet = (map === this.map_);

    this.map_ = map;

    this.invoke('setMap', map);

    if (!isSameMapAsCurrentlySet) {
      this.trigger(topic, this, map);
    }
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
  
  
  return MapObjectCollection;
});
