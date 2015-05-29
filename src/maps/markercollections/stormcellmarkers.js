define([
  'aeris/util',
  'aeris/maps/markercollections/pointdatamarkers',
  'aeris/maps/markers/stormcellmarker',
  'aeris/api/collections/geojsonfeaturecollection',
  'aeris/maps/strategy/markers/stormcells'
], function(_, PointDataMarkers, StormCellMarker, GeoJsonFeatureCollection, StormCellsStrategy) {
  /** @class StormCellMarkers */
  var StormCellMarkers = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      data: new GeoJsonFeatureCollection(null, {
        endpoint: 'stormcells',
        action: 'within',
        params: {
          limit: 100,
          fields: [
            'id',
            'place',
            'loc',
            'ob.hail',
            'ob.tvs',
            'ob.mda',
            'forecast'
          ]
        }
      }),
      model: StormCellMarker,
      strategy: _.noop,
      // StormCells do not yet support clustering
      clusterStrategy: null,
      cluster: false
    });


    PointDataMarkers.call(this, opt_models, options);
  };
  _.inherits(StormCellMarkers, PointDataMarkers);


  StormCellMarkers.prototype.toGeoJson = function() {
    return this.data_.toGeoJson();
  };

  StormCellMarkers.prototype.startClustering = function() {
    throw new Error('StormCellMarkers do not currently support clustering');
  };

  return _.expose(StormCellMarkers, 'aeris.maps.StormCells');
});
