define(['aeris', 'base/eventstrategy', 'base/eventstrategies/mixins/click'],
function(aeris) {

  /**
   * @fileoverview Click event strategy for OpenLayers
   */

  aeris.provide('aeris.maps.openlayers.eventstrategies.Click');


  /**
   * A strategy for support of a click event with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.EventStrategy}
   * @extends {aeris.maps.eventstrategies.mixins.Click}
   */
  aeris.maps.openlayers.eventstrategies.Click = function() {
    aeris.maps.EventStrategy.call(this);
  };
  aeris.inherits(aeris.maps.openlayers.eventstrategies.Click,
                 aeris.maps.EventStrategy);
  aeris.extend(aeris.maps.openlayers.eventstrategies.Click.prototype,
               aeris.maps.eventstrategies.mixins.Click);


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
    return control;
  };


  return aeris.maps.openlayers.eventstrategies.Click;

});
