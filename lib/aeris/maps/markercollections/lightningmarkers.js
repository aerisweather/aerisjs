define([
  'ai/util',
  'ai/maps/markercollections/pointdatamarkers',
  'ai/api/collections/lightning',
  'ai/maps/markers/lightningmarker'
], function(_, PointDataMarkers, LightningCollection, LightningMarker) {
  /**
   * @publicApi
   * @class LightningMarkers
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.markercollections.PointDataMarkers
   *
   * @constructor
   */
  var LightningMarkers = function(opt_markers, opt_options) {
    var options = _.extend({
      data: new LightningCollection(),
      model: LightningMarker
    }, opt_options);

    PointDataMarkers.call(this, opt_markers, options);
  };
  _.inherits(LightningMarkers, PointDataMarkers);


  return _.expose(LightningMarkers, 'aeris.maps.markercollections.LightningMarkers');
});
