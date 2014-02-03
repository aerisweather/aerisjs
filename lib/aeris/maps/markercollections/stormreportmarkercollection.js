define([
  'ai/util',
  'ai/maps/markercollections/pointdatamarkercollection',
  'ai/api/endpoint/collection/stormreportcollection',
  'ai/maps/markers/stormreportmarker',
  'ai/maps/markercollections/config/clusterstyles'
], function(_, PointDataMarkerCollection, StormReportCollection, StormReportMarker, clusterStyles) {
  /**
   * @publicApi
   * @class StormReportMarkers
   * @namespace aeris.maps
   * @extends aeris.maps.markercollections.PointDataMarkerCollection
   *
   * @constructor
   */
  var StormReportMarkerCollection = function(opt_markers, opt_options) {
    var options = _.extend({
      data: new StormReportCollection(),
      model: StormReportMarker,
      clusterStyles: clusterStyles.stormReport
    }, opt_options);

    PointDataMarkerCollection.call(this, opt_markers, options);
  };
  _.inherits(StormReportMarkerCollection, PointDataMarkerCollection);


  return _.expose(StormReportMarkerCollection, 'aeris.maps.StormReportMarkers');
});
