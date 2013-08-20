define(['aeris/util', 'aeris/aerisapi'], function(_) {

  /**
   * @fileoverview Shared implementation of AerisSunMoonDetailsClick strategy.
   */


  _.provide('aeris.maps.eventstrategies.mixins.AerisSunMoonDetailsClick');


  /**
   * A mixin for shared implementation of the AerisSunMoonDetailsClick strategy.
   *
   * @const
   */
  aeris.maps.eventstrategies.mixins.AerisSunMoonDetailsClick = {


    /**
     * @override
     */
    onClick: function(aerisEvent, map) {
      var self = this;
      function fn(event) {
        var latLon = self.getLatLonFromEvent(event, map);
        var promise = aeris.AerisAPI.getInstance().getSunMoon(latLon);
        promise.done(function(data) {
          aerisEvent.trigger('click', latLon, data);
        });
      }
      return fn;
    }
  };

});
