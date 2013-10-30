define([
  'aeris/util',
  'api/endpoint/config/pointdatacontext',
  'aeris/dateHelper',
  'api/endpoint/config/validfilters'
], function(_, pointDataContext, DateHelper, validFilters) {
  /**
   * Wired dependency spec for {aeris.api.endpoint.collection.StormReportCollection}
   * extends {aeris.api.endpoint.config.pointDataContext}
   *
   * @property aeris.api.endpoint.config.stormReportContext
   * @type {Object} WireJS spec
   */
  return _.extend({}, pointDataContext, {
    // Set StormReport Default params
    defaultParams: {
      from: new DateHelper().addDays(-2),
      to: new Date(),
      limit: 100
    },

    validFilters: validFilters.stormreports,

    endpoint: 'stormreports',
    action: 'within',
    model: { module: 'api/endpoint/model/stormreport' }
  });
});
