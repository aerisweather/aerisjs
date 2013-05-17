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


  /**
   * @override
   */
  aeris.maps.openlayers.eventstrategies.Click.prototype.setEvent =
      function(event, map) {
    var control = new OpenLayers.Control();
    control.handler = new OpenLayers.Handler.Click(control, {
      'click': this.onClick(event, map)
    }, {
      'single': true,
      'double': false,
      'pixelTolerance': 0,
      'stopSingle': false,
      'stopDouble': false
    });
    map.addControl(control);
    control.activate();
  };


  /**
   * Return a callback function that handles the click event.
   *
   * @param {aeris.maps.Event} aerisEvent The Event to trigger the click event
   *                                      for.
   * @param {Object} map The map the click occurs on.
   * @return {Function}
   * @protected
   */
  aeris.maps.openlayers.eventstrategies.Click.prototype.
      onClick = function(aerisEvent, map) {
    function fn(event) {
      aerisEvent.trigger('click', event);
    }
    return fn;
  };


  return aeris.maps.openlayers.eventstrategies.Click;

});
