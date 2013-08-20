define(['aeris/util', 'base/event'], function(_) {

  /**
   * @fileoverview Representation of a click event.
   */


  _.provide('aeris.maps.events.Click');


  /**
   * Representation of a click event.
   *
   * @constructor
   * @extends {aeris.maps.Event}
   */
  aeris.maps.events.Click = function() {
    aeris.maps.Event.call(this);
    this.strategy.push('Click');


    /**
     * @override
     */
    this.name = 'Click';

  };
  _.inherits(aeris.maps.events.Click, aeris.maps.Event);


  return aeris.maps.events.Click;

});
