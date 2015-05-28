define([
  'aeris/util',
  'aeris/api/collections/aerisapicollection',
  'aeris/api/models/aerisapimodel',
  'aeris/promise',
  'jquery'
], function(_, AerisApiCollection, AerisApiModel, Promise, $) {
  /** @class GeoJsonFeatureCollection */
  var GeoJsonFeatureCollection = function(geoJson, opt_options) {
    var models = geoJson ? this.parse(geoJson) : null;
    var options = _.defaults(opt_options || {}, {
      model: AerisApiModel,
      server: 'http://uat.hamweather.net/AerisGeoJSON',
      filter: [{
        name: 'geocol',
        operator: 'AND'
      }]
    });

    AerisApiCollection.call(this, models, options);
  };
  _.inherits(GeoJsonFeatureCollection, AerisApiCollection);

  GeoJsonFeatureCollection.prototype.parse = function(geoJson) {
    return geoJson.features;
  };

  GeoJsonFeatureCollection.prototype.toGeoJson = function() {
    return {
      type: 'FeatureCollection',
      features: this.toJSON()
    };
  };

  GeoJsonFeatureCollection.prototype.sync = function(method, model, opt_options) {
    var noop = function() {};
    var promiseToSync = new Promise();
    var options = _.defaults(opt_options || {}, {
      success: noop,
      error: noop,
      complete: noop
    });

    this.trigger('request', this, promiseToSync, opt_options);

    $.ajax({
      dataType: 'json',
      url: 'http://uat.hamweather.net/AerisGeoJSON/stormcells/within?p=27.527758206861886,-136.0107421875,50.233151832472245,-61.12792968750001&filter=geocol&query=&limit=1000&fields=loc,id,ob.hail,ob.mda,ob.tvs,forecast&sort=tor:-1,mda:-1,hail:-1&client_id=wgE96YE3scTQLKjnqiMsv&client_secret=DGCTq4z2xxttTBwTiimwlWyxmx5IDwK0VZ7T2WMS',
      success: function(res) {
        promiseToSync.resolve(res);
        this.trigger('sync', this, res, opt_options);
      }.bind(this),
      error: promiseToSync.reject
    });

    return promiseToSync.
      done(options.success).
      fail(options.error).
      always(options.complete);
  };

  return _.expose(GeoJsonFeatureCollection, 'aeris.api.collections.GeoJsonFeatureCollection');
});
