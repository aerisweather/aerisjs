define([
  'aeris/util',
  'aeris/maps/layers/layer',
  'aeris/api/collections/geojsonfeaturecollection',
  'aeris/maps/strategy/layers/geojson'
], function(_, Layer, GeoJsonFeatureCollection, GeoJsonStrategy) {
  /** @class GeoJson */
  var GeoJson = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      clickable: true
    });
    var options = _.defaults(opt_options || {}, {
      strategy: GeoJsonStrategy,
      attributeTransforms: {
        geoJson: function() {
          return this.data_.toGeoJson();
        }
      },
      style: {}
    });

    if (!options.data) {
      throw new Error('GeoJson layers must provide GeoJsonFeatureCollection data.');
    }

    // Normalize style as a function,
    // which receives the feature properties.
    this.getStyle = _.isFunction(options.style) ? options.style : _.constant(options.style);

    Layer.call(this, attrs, options);

    // Most MapExtensionObjects use data models,
    // but this layers uses a data collection.
    // So we need to manually re-sync every time the collection changes.
    this.listenTo(this.data_, {
      // Throttle, because otherwise this is called 100 times
      // when you add 100 models.
      'add remove reset': _.throttle(this.syncToModel.bind(this), 100)
    });
  };
  _.inherits(GeoJson, Layer);

  GeoJson.prototype.toGeoJson = function() {
    return this.data_.toGeoJson();
  };

  return _.expose(GeoJson, 'aeris.maps.layers.GeoJson');
});
