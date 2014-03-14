define([
  'aeris/util',
  'aeris/viewcollection'
], function(_, ViewCollection) {
  /**
   * A collection of {aeris.maps.MapObjectInterface} objects.
   *
   * @class MapObjectCollection
   * @namespace aeris.maps.extensions
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
   * @method setMap
   */
  MapObjectCollection.prototype.setMap = function(map, opt_options) {
    var options = opt_options || {};
    var topic = map ? 'map:set' : 'map:remove';
    var isSameMapAsCurrentlySet = (map === this.map_);

    this.map_ = map;

    this.invoke('setMap', map, options);

    if (!isSameMapAsCurrentlySet && !options.silent) {
      this.trigger(topic, this, map);
    }
  };


  /**
   * @method getMap
   */
  MapObjectCollection.prototype.getMap = function() {
    return this.map_;
  };


  /**
   * @override
   * @return {boolean}
   * @method hasMap
   */
  MapObjectCollection.prototype.hasMap = function() {
    return !!this.map_;
  };

  /**
   * From Backbone.Collection#_onModelEvent
   * @override
   * @method _onModelEvent
   */
  MapObjectCollection.prototype._onModelEvent = function(event, model, collection, options) {
    // Avoid bubbling 'map:set' and 'map:remove' events,
    // So that we do not get multiple events when the
    // collection's map is set.
    var isMapSetEvent = (event === 'map:set') || (event === 'map:remove');
    if (isMapSetEvent) { return; }

    ViewCollection.prototype._onModelEvent.apply(this, arguments);
  };


  return MapObjectCollection;
});
