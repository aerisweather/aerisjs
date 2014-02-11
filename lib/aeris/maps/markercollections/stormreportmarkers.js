define([
  'ai/util',
  'ai/maps/markercollections/pointdatamarkers',
  'ai/api/collections/stormreports',
  'ai/maps/markers/stormreportmarker',
  'ai/maps/markercollections/config/clusterstyles'
], function(_, PointDataMarkers, StormReportCollection, StormReportMarker, clusterStyles) {
  /**
   * @publicApi
   * @class StormReportMarkers
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.markercollections.PointDataMarkers
   *
   * @constructor
   */
  var StormReportMarkers = function(opt_markers, opt_options) {
    var options = _.extend({
      data: new StormReportCollection(),
      model: StormReportMarker,
      clusterStyles: clusterStyles.stormReport
    }, opt_options);

    PointDataMarkers.call(this, opt_markers, options);
  };
  _.inherits(StormReportMarkers, PointDataMarkers);


  return _.expose(StormReportMarkers, 'aeris.maps.markercollections.StormReportMarkers');
});
