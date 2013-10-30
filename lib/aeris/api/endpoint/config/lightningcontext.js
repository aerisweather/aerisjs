define([
  'aeris/util',
  'api/endpoint/config/pointdatacontext',
  'api/endpoint/config/validfilters'
], function(_, pointDataContext, validFilters) {
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

    validFilters: validFilters.lightning,

    model: { module: 'api/endpoint/model/lightning' },
    endpoint: 'lightning',
    action: 'within'
  });
});
