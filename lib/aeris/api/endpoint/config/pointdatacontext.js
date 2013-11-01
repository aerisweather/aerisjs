define([
  'aeris/util',
  'api/params/config/context'
], function(_, paramsContext) {
  /**
   * Wired dependency spec for {aeris.api.endpoint.collection.PointDataCollection}
   * Extends {aeris.api.params.config.context}
   *
   * @class aeris.api.endpoint.config.pointDataContext
   * @extends aeris.api.params.config.context
   */
  return _.extend({}, paramsContext, {
    // Defines a child class of PointDataCollection,
    // using optional configuration values.
    PointDataCollection: {
      create: {
        module: 'aeris/classfactory',
        args: [
          // Extend from PointDataCollection
          { module: 'api/endpoint/collection/pointdatacollection' },

          // Bind arguments
          [
            undefined,      // opt_models
            {
              model: { $ref: 'model' },
              endpoint: { $ref: 'endpoint' },
              action: { $ref: 'action' },

              // Reference params object,
              // spec'd out in params context
              params: { $ref: 'params' },

              validFilters: { $ref: 'validFilters' }
            }
          ],

          { extendArgObjects: true }
        ]
      }
    },

    // Override to define PointDataCollection endpoint
    endpoint: undefined,

    // Override to define PointDataCollection action
    action: undefined,

    // Override to define PointDataCollection model
    model: { module: 'api/endpoint/model/pointdata' }
  });
});
