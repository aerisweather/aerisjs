define(['aeris/util', 'base/eventstrategy', 'base/eventstrategies/mixins/click'],
function(_) {

  /**
   * @fileoverview Click event strategy for OpenLayers
   */

  _.provide('aeris.maps.openlayers.eventstrategies.Click');


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
  _.inherits(aeris.maps.openlayers.eventstrategies.Click,
                 aeris.maps.EventStrategy);
  _.extend(aeris.maps.openlayers.eventstrategies.Click.prototype,
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


  /**
   * @override
   */
  aeris.maps.openlayers.eventstrategies.Click.prototype.
      getLatLonFromEvent = function(event, map) {
    var lonLat = map.getLonLatFromPixel(event.xy);
    var lonLatGeo = lonLat.clone();
    if (map.getProjection() != 'EPSG:4326')
      lonLatGeo.transform(map.getProjectionObject(),
                          new OpenLayers.Projection('EPSG:4326'));
    var latLon = [lonLatGeo.lat, lonLatGeo.lon];
    return latLon;
  };


  return aeris.maps.openlayers.eventstrategies.Click;

});
