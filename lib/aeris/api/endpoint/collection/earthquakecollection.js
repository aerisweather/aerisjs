define([
  'aeris/util',
  'api/endpoint/collection/pointdatacollection',
  'api/endpoint/model/earthquake',
  'aeris/datehelper'
], function(_, PointDataCollection, Earthquake, DateHelper) {
  /**
   * A representation of earthquake data from the
   * Aeris API 'earthquake' endpoint.
   *
   * @class aeris.api.collection.EarthquakeCollection
   * @extends aeris.api.collection.PointDataCollection
   *
   * @constructor
   * @override
   */
  var EarthquakeCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      params: {},
      model: Earthquake,
      endpoint: 'earthquakes',
      action: 'within'
    });

    _.defaults(options.params, {
      from: new DateHelper().addWeeks(-7),
      to: new Date(),
      radius: '3000miles'
    });

    PointDataCollection.call(this, opt_models, options);
  };
  _.inherits(EarthquakeCollection, PointDataCollection)


  return EarthquakeCollection;
});
