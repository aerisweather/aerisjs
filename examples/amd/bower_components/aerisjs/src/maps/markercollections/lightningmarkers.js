define([
  'aeris/util',
  'aeris/maps/markercollections/pointdatamarkers',
  'aeris/api/collections/lightning',
  'aeris/maps/markers/lightningmarker',
  'aeris/maps/markercollections/config/clusterstyles'
], function(_, PointDataMarkers, LightningCollection, LightningMarker, clusterStyles) {
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
      model: LightningMarker,
      clusterStyles: clusterStyles.lightning
    }, opt_options);

    PointDataMarkers.call(this, opt_markers, options);
  };
  _.inherits(LightningMarkers, PointDataMarkers);


  return _.expose(LightningMarkers, 'aeris.maps.markercollections.LightningMarkers');
});
