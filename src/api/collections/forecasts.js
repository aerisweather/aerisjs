define([
  'aeris/util',
  'aeris/api/collections/pointdatacollection',
  'aeris/api/models/forecast'
], function(_, PointDataCollection, Forecast) {
  /**
   * @publicApi
   * @class Forecasts
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.PointDataCollection
   *
   * @constructor
   */
  var Forecasts = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'forecasts',
      action: 'closest',
      model: Forecast
    });

    PointDataCollection.call(this, opt_models, options);
  };
  _.inherits(Forecasts, PointDataCollection);


  return _.expose(Forecasts, 'aeris.api.collections.Forecasts');
});
