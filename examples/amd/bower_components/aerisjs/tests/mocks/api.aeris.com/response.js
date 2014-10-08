define([
  'aeris/util'
], function(_) {
  /**
   * Base constructor for creating Aeris API response objects.
   *
   * @param {Number} count Response count.
   * @param {function(Number):Object} createResponseObject
   *        This function is passed the response index, and should
   *        return a response object.
   *
   * @return {Object} Stub Aeris API Response
   */
  return function Response(count, createResponseObject) {
    return {
      success: true,
      response: _.range(0, count).map(function(i) {
        return _.extend({
          id: _.uniqueId('ResponseData_'),
          loc: {
            lat: 45 + i,
            long: -90 - i
          }
        }, createResponseObject(i));
      })
    };
  };
});
