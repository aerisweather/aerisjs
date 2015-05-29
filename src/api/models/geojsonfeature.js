define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  var GeoJsonFeature = function(opt_attrs, opt_options) {
    AerisApiModel.call(this, opt_attrs, opt_options);
  };
  _.inherits(GeoJsonFeature, AerisApiModel);

  GeoJsonFeature.prototype.parse = function(attrs) {
    attrs.id = attrs.properties.id;

    return attrs;
  };

  return GeoJsonFeature;
});
