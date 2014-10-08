define(['aeris/util'], function(_) {
  /**
   * Logical operators for use in constructing
   * queries included in Aeris API requests.
   *
   * @class aeris.api.Operator
   * @static
   */
  var Operators = {
    AND: 'AND',
    OR: 'OR'
  };


  return _.expose(Operators, 'aeris.api.Operator');
});
