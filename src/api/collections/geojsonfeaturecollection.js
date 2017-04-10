define([
  'aeris/util',
  'aeris/api/collections/aerisapicollection',
  'aeris/api/models/geojsonfeature',
  'aeris/promise',
  'jquery'
], function(_, AerisApiCollection, GeoJsonFeature, Promise, $) {
  /** @class GeoJsonFeatureCollection */
  var GeoJsonFeatureCollection = function(geoJson, opt_options) {
    var models = geoJson ? this.parse(geoJson) : null;
    var options = _.defaults(opt_options || {}, {
      model: GeoJsonFeature
    });

    options.params = _.extend({}, options.params || {}, {
      format: 'geojson'
    });

    AerisApiCollection.call(this, models, options);
  };
  _.inherits(GeoJsonFeatureCollection, AerisApiCollection);

  GeoJsonFeatureCollection.prototype.parse = function(geoJson) {
    var models = geoJson.features;
    return AerisApiCollection.prototype.parse.call(this, models);
  };

  GeoJsonFeatureCollection.prototype.toGeoJson = function() {
    return {
      type: 'FeatureCollection',
      features: this.toJSON()
    };
  };

  GeoJsonFeatureCollection.prototype.isSuccessResponse_ = function(res) {
    return !res.error;
  };

  return _.expose(GeoJsonFeatureCollection, 'aeris.api.collections.GeoJsonFeatureCollection');
});
