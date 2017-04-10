define([
  'aeris/util',
  'aeris/maps/markercollections/pointdatamarkers',
  'aeris/maps/markers/stormcellmarker',
  'aeris/api/collections/geojsonfeaturecollection'
], function(_, PointDataMarkers, StormCellMarker, GeoJsonFeatureCollection) {
  /** @class StormCellMarkers */
  var StormCellMarkers = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      data: new GeoJsonFeatureCollection(null, {
        endpoint: 'stormcells',
        action: 'within',
        params: {
          p: ':auto',
          radius: '3000mi',
          limit: 1000,
          fields: [
            'id',
            'place',
            'loc',
            'ob',
            'forecast',
            'traits'
          ],
          sort: 'tor:-1,mda:-1,hail:-1'
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

  return StormCellMarkers;
});
