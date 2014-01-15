/**
 * Wires together parameters and filters.
 *
 * @class aeris.api.params.config.context
 */
define({
  // Override to set default param attributes.
  defaultParams: {},

  params: {
    create: {
      module: 'ai/api/params/model/params',
      args: [
        { $ref: 'defaultParams' },
        {
          filter: { $ref: 'FilterCollection' }
        }
      ]
    }
  },

  FilterCollection: _.classFactorySpec({
    create: {
      module: 'ai/api/params/collection/filtercollection',
      args: [
        undefined,
        {
          model: { $ref: 'Filter' }
        }
      ]
    }
  }),

  Filter: { module: 'ai/api/params/model/filter' },

  // This can be defined in
  // sub-contexts,
  // and will be injected
  // into the Filter model used
  // for our params
  validFilters: undefined
});
