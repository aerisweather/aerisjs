define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class CommandHistoryError
   * @namespace aeris.errors
   * @extends aeris.errors.AbstractError
  */
  return new ErrorTypeFactory({
    name: 'CommandHistoryError'
  });
});
