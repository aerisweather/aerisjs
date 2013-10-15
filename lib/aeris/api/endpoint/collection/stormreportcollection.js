define([
  'aeris/util',
  'aeris/datehelper',
  'api/endpoint/collection/pointdatacollection',
  'api/endpoint/model/stormreport'
], function(_, DateHelper, PointDataCollection, StormReport) {
  /**
   * A representation of storm report data from the
   * Aeris API 'stormreports' endpoint.
   *
   * @class aeris.api.collection.StormReportCollection
   * @extends aeris.api.collection.PointDataCollection
   *
   * @constructor
   * @override
   */
  var StormReportCollection = function(opt_models, opt_options) {
    var options = _.extend({
      model: StormReport,
      endpoint: 'stormreports',
      action: 'within',
      params: {
        from: (new DateHelper()).addDays(-2),
        to: new Date(),
        limit: 200
      }
    }, opt_options);

    PointDataCollection.call(this, opt_models, options);
  };
  _.inherits(StormReportCollection, PointDataCollection);


  return StormReportCollection;
});
