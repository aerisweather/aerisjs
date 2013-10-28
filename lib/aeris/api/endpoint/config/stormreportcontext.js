define([
  'aeris/util',
  'api/params/config/context',
  'aeris/dateHelper'
], function(_, paramsContext, DateHelper) {
  return _.extend(paramsContext, {
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

    StormReportCollection: {
      create: {
        module: 'aeris/classfactory',
        args: [
          // Extend from PointDataCollection
          { module: 'api/endpoint/collection/pointdatacollection' },

          // Bind arguments
          [
            undefined,      // opt_models
            {
              model: { module: 'api/endpoint/model/stormreport' },
              endpoint: 'stormreports',
              action: 'within',
              params: { $ref: 'params' }
            }
          ],

          { extendArgObjects: true }
        ]
      }
    }

  });
});
