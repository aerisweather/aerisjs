define(['aeris', 'base/eventstrategy'], function(aeris) {

  /**
   * @fileoverview Click event strategy for OpenLayers
   */

  aeris.provide('aeris.maps.openlayers.eventstrategies.Click');


  /**
   * A strategy for support of a click event with OpenLayers.
   *
   * @constructor
   * @extens {aeris.maps.EventStrategy}
   */
  aeris.maps.openlayers.eventstrategies.Click = function() {
    aeris.maps.EventStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.eventstrategies.Click,
                 aeris.maps.EventStrategy);


  return aeris.maps.openlayers.eventstrategies.Click;

});
