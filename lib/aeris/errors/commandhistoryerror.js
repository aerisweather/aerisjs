define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class aeris.errors.CommandHistoryError
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'CommandHistoryError'
  });
});