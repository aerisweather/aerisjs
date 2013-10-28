define([
  'aeris/util',
  'aeris/datehelper',
  'api/endpoint/config/pointdatacontext'
], function(_, DateHelper, pointDataContext) {
  /**
   * Wired dependency spec for {aeris.api.endpoint.collection.EarthquakeCollection}
   * extends {aeris.api.endpoint.config.pointDataContext}
   *
   * @property aeris.api.endpoint.config.earthquakeContext
   * @type {Object} WireJS spec
   */
  return _.extend({}, pointDataContext, {
    defaultParams: {
      from: new DateHelper().addDays(-2),
      to: new Date()
    },

    validFilters: [
      'mini',
      'minor',
      'light',
      'moderate',
      'strong',
      'major',
      'great',
      'shallow'
    ],

    model: { module: 'api/endpoint/model/earthquake' },
    endpoint: 'earthquakes',
    action: 'within'
  });
});
