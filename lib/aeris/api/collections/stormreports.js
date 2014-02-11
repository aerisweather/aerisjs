define([
  'ai/util',
  'ai/api/collections/pointdatacollection',
  'ai/api/models/stormreport',
  'ai/datehelper'
], function(_, PointDataCollection, StormReport, DateHelper) {
  /**
   * A representation of storm report data from the
   * Aeris API 'stormreports' endpoint.
   *
   * @publicApi
   * @class StormReports
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.PointDataCollection
   *
   * @constructor
   * @override
   */
  var StormReports = function(opt_models, opt_options) {
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
  _.inherits(StormReports, PointDataCollection)
  
  
  return _.expose(StormReports, 'aeris.api.collections.StormReports');
});
