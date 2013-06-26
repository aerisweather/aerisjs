define(['aeris', 'aeris/events', 'base/extension/mapextensionobject'],
function(aeris) {

  /**
   * @fileoverview Interface definition for defining a map event.
   */


  aeris.provide('aeris.maps.Event');


  /**
   * An Event is an abstract representation of a map event.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionObject}
   * @extends {aeris.Events}
   */
  aeris.maps.Event = function() {
    aeris.maps.extension.MapExtensionObject.call(this);
    aeris.Events.call(this);
  };
  aeris.inherits(aeris.maps.Event, aeris.maps.extension.MapExtensionObject);
  aeris.extend(aeris.maps.Event.prototype, aeris.Events.prototype);


  /**
   * @override
   */
  aeris.maps.Event.prototype.setMap = function(aerisMap) {
    aeris.maps.extension.MapExtensionObject.prototype.setMap.
        call(this, aerisMap);
    this.aerisMap.events.setEvent(this);
  };


  return aeris.maps.Event;

});
