define([
  'aeris/util',
  'api/endpoint/config/pointdatacontext',
  'aeris/dateHelper'
], function(_, pointDataContext, DateHelper) {
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

    validFilters: [
      'avalanche',
      'blizzard',
      'flood',
      'fog',
      'ice',
      'hail',
      'lightning',
      'rain',
      'snow',
      'tides',
      'tornado',
      'wind'
    ],

    endpoint: 'stormreports',
    action: 'within',
    model: { module: 'api/endpoint/model/stormreport' }
  });
});
