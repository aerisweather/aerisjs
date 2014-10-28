define([
  'aeris/util',
  'aeris/maps/markercollections/pointdatamarkers',
  'aeris/maps/markers/firemarker',
  'aeris/api/collections/fires',
  'aeris/maps/markercollections/config/clusterstyles'
], function(_, PointDataMarkers, FireMarker, FireCollection, clusterStyles) {
  /**
   * @publicApi
   * @class aeris.maps.markercollections.FireMarkers
   * @extends aeris.maps.markercollections.PointDataMarkers
   *
   * @constructor
   */
  var FireMarkers = function(opt_markers, opt_options) {
    var options = _.extend({
      model: FireMarker,
      data: new FireCollection(),
      clusterStyles: clusterStyles.fire
    }, opt_options);

    PointDataMarkers.call(this, opt_markers, options);
  };
  _.inherits(FireMarkers, PointDataMarkers);


  return _.expose(FireMarkers, 'aeris.maps.markercollections.FireMarkers');
});
