define([
  'ai/util',
  'ai/maps/markercollections/pointdatamarkers',
  'ai/maps/markers/firemarker',
  'ai/api/collections/fires'
], function(_, PointDataMarkerCollection, FireMarker, FireCollection) {
  /**
   * @publicApi
   * @class FireMarkers
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.markercollections.PointDataMarkers
   *
   * @constructor
   */
  var FireMarkerCollection = function(opt_markers, opt_options) {
    var options = _.extend({
      model: FireMarker,
      data: new FireCollection()
    }, opt_options);

    PointDataMarkerCollection.call(this, opt_markers, options);
  };
  _.inherits(FireMarkerCollection, PointDataMarkerCollection);


  return _.expose(FireMarkerCollection, 'aeris.maps.markercollections.FireMarkers');
});
