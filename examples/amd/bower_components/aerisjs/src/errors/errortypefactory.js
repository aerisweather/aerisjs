define([
  'aeris/util',
  'aeris/errors/abstracterror'
], function(_, AbstractError) {
  /**
   * Create custom Error classes on the fly.
   *
   * @class ErrorTypeFactory
   * @param {Object} config
   * @param {function():Error=} config.type Parent error type. Defaults to aeris.errors.AbstractError.
   * @param {string} config.name
   * @param {string=} config.message
   *
   * @return {function():Error} Error object constructor.
   * @constructor
   */
  var ErrorTypeFactory = function(config) {
    var ErrorType;

    _.defaults(config, {
      type: AbstractError
    });

    this.ParentType_ = config.type;

    ErrorType = this.initializeType_();


    ErrorType.prototype.setName = function() {
      return config.name;
    };

    ErrorType.prototype.setMessage = function() {
      var messageCb = config.message || function(msg) { return msg; };

      return messageCb.apply(this, arguments);
    };

    return ErrorType;
  };


  /**
   * @return {function():Error}
   * @private
   */
  ErrorTypeFactory.prototype.initializeType_ = function() {
    var ParentType = this.ParentType_;
    var Type = function(var_args) {
      ParentType.apply(this, arguments);
    };
    _.inherits(Type, ParentType);

    return Type;
  };


  return ErrorTypeFactory;
});
