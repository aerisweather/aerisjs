define([
  'aeris/util',
  'aeris/api/collections/pointdatacollection',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/stormreport',
  'aeris/datehelper'
], function(_, PointDataCollection, AerisApiClientCollection, StormReport, DateHelper) {
  /**
   * A representation of storm report data from the
   * Aeris API 'stormreports' endpoint.
   *
   * @publicApi
   * @class StormReports
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.AerisApiClientCollection
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
      model: StormReport,
      SourceCollectionType: PointDataCollection
    });

    AerisApiClientCollection.call(this, opt_models, options);

    /**
     * @property sourceCollection_
     * @type {aeris.api.collections.PointDataCollection}
     */
  };
  _.inherits(StormReports, AerisApiClientCollection);


  return _.expose(StormReports, 'aeris.api.collections.StormReports');
});
