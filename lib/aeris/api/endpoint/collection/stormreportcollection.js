define([
  'aeris/util',
  'api/endpoint/collection/pointdatacollection',
  'api/endpoint/model/stormreport',
  'aeris/datehelper'
], function(_, PointDataCollection, StormReport, DateHelper) {
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
    var options = _.defaults(opt_options || {}, {
      params: {
        from: new DateHelper().addDays(-2),
        to: new Date(),
        limit: 100
      },
      endpoint: 'stormreports',
      action: 'within',
      model: StormReport
    });
    
    PointDataCollection.call(this, opt_models, options);
  };
  _.inherits(StormReportCollection, PointDataCollection)
  
  
  return StormReportCollection;
});
