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
          filter: [{ name: 'geocol', operator: 'AND' }]
        }
      }),
      model: StormCellMarker,
      strategy: StormCellsStrategy,
      // StormCells do not yet support clustering
      clusterStrategy: null,
      cluster: false,
      style: this.getStyleDefault_.bind(this)
    });

    this.getStyle = _.isFunction(options.style) ? options.style : _.constant(options.style);

    PointDataMarkers.call(this, opt_models, options);
  };
  _.inherits(StormCellMarkers, PointDataMarkers);


  StormCellMarkers.prototype.toGeoJson = function() {
    return this.data_.toGeoJson();
  };

  StormCellMarkers.prototype.getStyleDefault_ = function(properties) {
    var styles = {
      cell: {
        radius: 4,
        fillColor: 'green',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        hover: {
          radius: 7,
          fillOpacity: 1
        }
      },
      cone: {
        stroke: true,
        color: '#030303',
        weight: 1,
        opacity: 0.8,
        fillColor: '#f66',
        fillOpacity: 0.2,
        hover: {
          weight: 2,
          fillOpacity: 0.8,
          fillColor: '#f66'
        }
      },
      line: {
        stroke: true,
        color: '#030303',
        weight: 1,
        opacity: 0.8,
        hover: {}
      }
    };

    // Tornado
    if (properties.ob.tvs > 0 || properties.ob.mda > 10) {
      _.extend(styles.cell, {
        radius: 5,
        fillColor: 'red'
      });
    }
    // Hail
    else if (properties.ob.hail && properties.ob.hail.prob >= 70) {
      _.extend(styles.cell, {
        radius: 5,
        fillColor: 'yellow'
      });
    }
    // rotating
    else if (properties.ob.mda > 0) {
      _.extend(styles.cell, {
        radius: 5,
        fillColor: 'orange'
      });
    }

    return styles;
  };

  StormCellMarkers.prototype.startClustering = function() {
    throw new Error('StormCellMarkers do not currently support clustering');
  };

  return _.expose(StormCellMarkers, 'aeris.maps.StormCells');
});
