define([
  'aeris/util',
  'api/endpoint/config/pointdatacontext'
], function(_, pointDataContext) {
  /**
   * Wired dependency spec for {aeris.api.endpoint.collection.LightningCollection}
   * extends {aeris.api.endpoint.config.pointDataContext}
   *
   * @property aeris.api.endpoint.config.lightningContext
   * @type {Object} WireJS spec
   */
  return _.extend({}, pointDataContext, {
    defaultParams: {
      limit: 200
    },

    validFilters: undefined,

    model: { module: 'api/endpoint/model/lightning' },
    endpoint: 'lightning',
    action: 'within'
  });
});
