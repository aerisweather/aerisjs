define([
  'aeris/util',
  'aeris/maps/layers/layer',
  'aeris/api/collections/geojsonfeaturecollection',
  'aeris/maps/strategy/layers/geojson'
], function(_, Layer, GeoJsonFeatureCollection, GeoJsonStrategy) {
  /** @class StormCellSummary */
  var StormCellSummary = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      data: new GeoJsonFeatureCollection(null, {
        endpoint: 'stormcells',
        action: 'summary',
        params: {
          filter: [
            {
              name: 'threat',
              operator: 'AND'
            },
            {
              name: 'geo',
              operator: 'AND'
            }
          ]
        }
      }),
      strategy: GeoJsonStrategy,
      attributeTransforms: {
        geoJson: function() {
          return this.data_.toGeoJson();
        }
      },
      style: {
        stroke: true,
        color: '#030303',
        weight: 1,
        opacity: .8,
        fillColor: 'orange',
        fillOpacity: 0.4
      }
    });
    var attrs = _.defaults(opt_attrs || {}, {
      clickable: false
    });

    Layer.call(this, attrs, options);

    this.style_ = options.style;

    this.listenTo(this.data_, {
      'add remove reset': _.throttle(this.syncToModel.bind(this), 100)
    });
  };
  _.inherits(StormCellSummary, Layer);

  StormCellSummary.prototype.toGeoJson = function() {
    return this.data_.toGeoJson();
  };

  StormCellSummary.prototype.getStyle = function() {
    return this.style_;
  };

  return _.expose(StormCellSummary, 'aeris.maps.layers.StormCellSummary');
});
