define([
  'aeris/util',
  'aeris/datehelper',
  'api/endpoint/collection/pointdatacollection',
  'api/endpoint/model/earthquake'
], function(_, DateHelper, PointDataCollection, Earthquake) {
  /**
   * A representation of earthquake data from the
   * Aeris API 'earthquakes' endpoint.
   *
   * @class aeris.api.collection.EarthquakeCollection
   * @extends aeris.api.collection.PointDataCollection
   *
   * @constructor
   * @override
   */
  var EarthquakeCollection = function(opt_models, opt_options) {
    var options = _.extend({
      model: Earthquake,
      endpoint: 'earthquakes',
      action: 'within',
      params: {
        limit: 500,
        from: (new DateHelper()).addDays(-2),
        to: new Date()
      }
    }, opt_options);

    PointDataCollection.call(this, opt_models, options);
  };
  _.inherits(EarthquakeCollection, PointDataCollection);


  return EarthquakeCollection;
});
