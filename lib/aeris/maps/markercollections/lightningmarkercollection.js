define([
  'ai/util',
  'ai/maps/markercollections/pointdatamarkercollection',
  'ai/api/endpoint/collection/lightningcollection',
  'ai/maps/markers/lightningmarker'
], function(_, PointDataMarkerCollection, LightningCollection, LightningMarker) {
  /**
   * @class aeris.maps.LightningMarkers
   * @extends aeris.maps.markercollections.PointDataMarkerCollection
   *
   * @constructor
   */
  var LightningMarkerCollection = function(opt_markers, opt_options) {
    var options = _.extend({
      data: new LightningCollection(),
      model: LightningMarker
    }, opt_options);

    PointDataMarkerCollection.call(this, opt_markers, options);
  };
  _.inherits(LightningMarkerCollection, PointDataMarkerCollection);


  return _.expose(LightningMarkerCollection, 'aeris.maps.LightningMarkers');
});
