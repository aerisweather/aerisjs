define([
  'aeris/util',
  'aeris/maps/layers/layer',
  'aeris/api/collections/geojsonfeaturecollection',
  'aeris/maps/strategy/layers/geojson'
], function(_, Layer, GeoJsonFeatureCollection, GeoJsonStrategy) {
  /** @class GeoJson */
  var GeoJson = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      strategy: GeoJsonStrategy,
      attributeTransforms: {
        geoJson: function() {
          return this.data_.toGeoJson();
        }
      }
    });
    var attrs = _.defaults(opt_attrs || {}, {
      clickable: true,
      style: {}
    });

    if (!options.data) {
      throw new Error('GeoJson layers must provide GeoJsonFeatureCollection data.');
    }

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

  GeoJson.prototype.getStyle = function() {
    return this.get('style');
  };

  return _.expose(GeoJson, 'aeris.maps.layers.GeoJson');
});
