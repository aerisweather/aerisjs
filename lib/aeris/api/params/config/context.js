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
      module: 'api/params/model/params',
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
      module: 'api/params/collection/filtercollection',
      args: [
        undefined,
        {
          model: { $ref: 'Filter' }
        }
      ]
    }
  }),

  Filter: { module: 'api/params/model/filter' },

  // This can be defined in
  // sub-contexts,
  // and will be injected
  // into the Filter model used
  // for our params
  validFilters: undefined
});
