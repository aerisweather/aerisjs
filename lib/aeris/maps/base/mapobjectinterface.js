define([
  'aeris/util',
  'aeris/errors/unimplementedmethoderror'
], function(_, UnimplementedMethodError) {
  /**
   * A MapObjectInterface describes an
   * object which has some relationship with
   * a {aeris.maps.Map} object.
   *
   * @class aeris.maps.MapObjectInterface
   * @interface
   *
   * @constructor
   */
  var MapObjectInterface = function() {
    /**
     * Triggered when a map is set to a
     * MapObjectInterface.
     *
     * @event 'map:set'
     * @param {aeris.maps.MapObjectInterface} mapObject
     * @param {aeris.maps.Map} map
     * @param {Object=} options Options passed to setMap method.
     */
    /**
     * Triggered when a map is removed from
     * a MapObjectInterface (ie, map was set to null).
     *
     * @event 'map:remove'
     * @param {aeris.maps.MapObjectInterface} mapObject
     * @param {null} null
     * @param {Object=} options Options passed to setMap method.
     */
  };

  /**
   * Associates a map with the map object.
   *
   * Setting the map to null is equivalent to
   * removing the object from the map.
   *
   * @param {?aeris.maps.Map} aerisMap The map to bind to.
   */
  MapObjectInterface.prototype.setMap = function(aerisMap) {
    throw new UnimplementedMethodError('A MapObject must implement a setMap method');
  };


  /**
   * Gets the map associtaed with the map object.
   *
   * @return {aeris.maps.Map}
   */
  MapObjectInterface.prototype.getMap = function() {
    throw new UnimplementedMethodError('A MapObject must implement a getMap method');
  };


  /**
   * @return {Boolean} Returns true if the layer has a map set.
   */
  MapObjectInterface.prototype.hasMap = function() {
    throw new UnimplementedMethodError('A MapObject must implement a hasMap method');
  };


  return MapObjectInterface;
});
