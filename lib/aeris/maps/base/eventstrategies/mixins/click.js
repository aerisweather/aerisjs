define(['aeris'], function(aeris) {

  /**
   * @fileoverview Shared implementation of the Click strategy.
   */


  aeris.provide('aeris.maps.eventstrategies.mixins.Click');


  /**
   * A mixin for shared implementation of the Click strategy.
   *
   * @const
   */
  aeris.maps.eventstrategies.mixins.Click = {


    /**
     * Return a callback function that handles the click event.
     *
     * @param {aeris.maps.Event} aerisEvent The Event to trigger the click event
     *                                      for.
     * @param {Object} map The map the click occurs on.
     * @return {Function}
     * @protected
     */
    onClick: function(aerisEvent, map) {
      function fn(event) {
        aerisEvent.trigger('click', event);
      }
      return fn;
    }

  };


  return aeris.maps.eventstrategies.mixins.Click;

});
