define([
  'aeris/util',
  'aeris/api/models/aerisapimodel'
], function(_, AerisApiModel) {
  /**
   * @publicApi
   * @class Place
   * @namespace aeris.api.models
   * @extends aeris.api.models.AerisApiModel
   *
   * @constructor
   * @override
   */
  var Place = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: 'places'
    });

    AerisApiModel.call(this, opt_attrs, options);
  };
  _.inherits(Place, AerisApiModel);

  return _.expose(Place, 'aeris.api.models.Place');
});
