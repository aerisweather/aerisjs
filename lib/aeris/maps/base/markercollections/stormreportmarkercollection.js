define([
  'aeris/util',
  'base/markercollections/pointdatamarkercollection',
  'api/endpoint/collection/stormreportcollection',
  'base/markers/stormreportmarker'
], function(_, PointDataMarkerCollection, StormReportCollection, StormReportMarker) {
  /**
   * @class aeris.maps.StormReportMarkers
   * @extends aeris.maps.markercollections.PointDataMarkerCollection
   *
   * @constructor
   */
  var StormReportMarkerCollection = function(opt_markers, opt_options) {
    var options = _.extend({
      data: new StormReportCollection(),
      marker: StormReportMarker
    }, opt_options);

    PointDataMarkerCollection.call(this, opt_markers, options);
  };
  _.inherits(StormReportMarkerCollection, PointDataMarkerCollection);


  return _.expose(StormReportMarkerCollection, 'aeris.maps.StormReportMarkers');
});
