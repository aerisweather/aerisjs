define(['aeris', 'base/event'], function(aeris) {

  /**
   * @fileoverview Representation of a click event.
   */


  aeris.provide('aeris.maps.events.Click');


  /**
   * Representation of a click event.
   *
   * @constructor
   * @extends {aeris.maps.Event}
   */
  aeris.maps.events.Click = function() {
    aeris.maps.Event.call(this);
    this.strategy.push('Click');
  };
  aeris.inherits(aeris.maps.events.Click, aeris.maps.Event);


  return aeris.maps.events.Click;

});
