define([
  'aeris/util',
  'aeris/model'
], function(_, BaseModel) {
  /**
   * Represents the query parameters in a
   * request to the AerisApi
   *
   * @class aeris.api.params.model.Query
   * @extends aeris.Model
   *
   * @constructor
   */
  var Query = function(opt_attrs, opt_options) {
    BaseModel.call(this, opt_attrs, opt_options);
  };
  _.inherits(Query, BaseModel);

  return Query;
});
