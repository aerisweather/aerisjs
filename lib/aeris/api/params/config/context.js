/**
 * Wires together parameters an filters.
 *
 * @property aeris.api.params.config.context
 * @type {Object} WireJS Spec.
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

  FilterCollection: {
    create: {
      module: 'aeris/classfactory',
      args: [
        // Sub-class BaseFilterCollection
        { module: 'api/params/collection/filtercollection' },

        // Bind FilterCollection ctor to these
        // arguments
        [undefined, {
          model: { $ref: 'Filter' }
        }],
        { extendArgObjects: true }
      ]
    }
  },

  Filter: {
    create: {
      module: 'aeris/classfactory',
      args: [
        // Sub-class BaseFilter
        { module: 'api/params/model/filter' },

        // Bind BaseFilter ctor to these arguments
        [undefined, {
          validFilters: { $ref: 'validFilters' }
        }],
        { extendArgObjects: true }
      ]
    }
  },

  // This can be defined in
  // sub-contexts,
  // and will be injected
  // into the Filter model used
  // for our params
  validFilters: undefined
});
