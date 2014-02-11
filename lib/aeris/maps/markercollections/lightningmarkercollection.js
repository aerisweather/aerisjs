define([
  'ai/util',
  'ai/maps/markercollections/pointdatamarkercollection',
  'ai/api/endpoint/collections/lightningcollection',
  'ai/maps/markers/lightningmarker'
], function(_, PointDataMarkerCollection, LightningCollection, LightningMarker) {
  /**
   * @publicApi
   * @class LightningMarkers
   * @namespace aeris.maps.markercollections
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


  return _.expose(LightningMarkerCollection, 'aeris.maps.markercollections.LightningMarkerCollection');
});
