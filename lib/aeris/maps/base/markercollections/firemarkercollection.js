define([
  'aeris/util',
  'base/markercollections/pointdatamarkercollection',
  'base/markers/firemarker',
  'api/endpoint/collection/firecollection'
], function(_, PointDataMarkerCollection, FireMarker, FireCollection) {
  /**
   * @class aeris.maps.FireMarkers
   * @extends aeris.maps.markercollections.PointDataMarkerCollection
   *
   * @constructor
   */
  var FireMarkerCollection = function(opt_markers, opt_options) {
    var options = _.extend({
      marker: FireMarker,
      data: new FireCollection()
    }, opt_options);

    PointDataMarkerCollection.call(this, opt_markers, options);
  };
  _.inherits(FireMarkerCollection, PointDataMarkerCollection);


  return _.expose(FireMarkerCollection, 'aeris.maps.FireMarkers');
});
