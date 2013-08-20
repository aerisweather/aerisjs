define(['aeris/util'], function(_) {

  /**
   * @fileoverview Shared implementation of the Click strategy.
   */


  _.provide('aeris.maps.eventstrategies.mixins.Click');


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
      var self = this;
      function fn(event) {
        var latLon = self.getLatLonFromEvent(event, map);
        aerisEvent.trigger('click', latLon);
      }
      return fn;
    },

    /**
     * Extract the latitude and longitude array from the click event.
     *
     * @param {Object} event The click event.
     * @param {Object} map The map the click occurred on.
     * @return {Array.<number,number>}
     * @protected
     */
    getLatLonFromEvent: _.abstractMethod

  };


  return aeris.maps.eventstrategies.mixins.Click;

});
