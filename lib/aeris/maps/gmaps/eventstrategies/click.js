define(['aeris', 'base/eventstrategy', 'base/eventstrategies/mixins/click'],
function(aeris) {

  /**
   * @fileoverview Click event strategy for GMaps.
   */


  aeris.provide('aeris.maps.gmaps.eventstrategies.Click');


  /**
   * A strategy for support of a click event with GMaps.
   *
   * @constructor
   * @extends {aeris.maps.EventStrategy}
   * @extends {aeris.maps.eventstrategies.mixins.Click}
   */
  aeris.maps.gmaps.eventstrategies.Click = function() {
    aeris.maps.EventStrategy.call(this);
  };
  aeris.inherits(aeris.maps.gmaps.eventstrategies.Click,
                 aeris.maps.EventStrategy);
  aeris.extend(aeris.maps.gmaps.eventstrategies.Click.prototype,
               aeris.maps.eventstrategies.mixins.Click);


  /**
   * @override
   */
  aeris.maps.gmaps.eventstrategies.Click.prototype.setEvent =
      function(event, map) {
    google.maps.event.addListener(map, 'click', this.onClick(event, map));
    return true;
  };

  /**
   * @override
   */
  aeris.maps.gmaps.eventstrategies.Click.prototype.getLatLonFromEvent = function(event, map) {
    var latLon = [event.latLng.lat(), event.latLng.lng()];
    return latLon;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.eventstrategies.Click.prototype.
      getLatLonFromEvent = function(event, map) {
    var latLon = [event.latLng.lat(), event.latLng.lng()];
    return latLon;
  };


  return aeris.maps.gmaps.eventstrategies.Click;

});
