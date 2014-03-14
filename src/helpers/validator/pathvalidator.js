define([
  'aeris/util',
  'aeris/helpers/validator/abstractvalidator',
  'aeris/helpers/validator/errors/pathvalidationerror'
], function(_, AbstractValidator, PathValidationError) {
  /**
   * @class PathValidator
   * @namespace aeris.helpers.validator
   * @extends aeris.helpers.validator.AbstractValidator
   *
   * @constructor
   * @override
   *
   * @param {aeris.maps.Path} path
   */
  var PathValidator = function(path) {
    this.path_ = path;

    AbstractValidator.apply(this, arguments);
  };
  _.inherits(PathValidator, AbstractValidator);


  /**
   * @param {aeris.maps.Path} path
   * @method setPath
   */
  PathValidator.prototype.setPath = function(path) {
    this.path_ = path;
  };


  /**
   * @override
   * @method isValid
   */
  PathValidator.prototype.isValid = function() {
    var hasLength = this.path_ && this.path_.length !== 0;
    var isEmptyArray = _.isArray(this.path_) && !hasLength;
    var hasValidLatLon = hasLength && this.isValidLatLon_(this.path_[0]);
    var isValid = isEmptyArray || hasValidLatLon;
    var errorMsg = this.path_ + 'is not a valid path.';

    this.clearLastError_();

    if (!isValid) {
      this.setLastError_(new PathValidationError(errorMsg));
    }

    return isValid;
  };


  /**
   * @private
   * @method isValidLatLon_
   */
  PathValidator.prototype.isValidLatLon_ = function(latLon) {
    var isLatLonTwoNumbers = latLon && latLon.length === 2 &&
      _.isNumber(latLon[0]) && _.isNumber(latLon[1]);

    return _.isArray(latLon) && isLatLonTwoNumbers;
  };


  return PathValidator;
});
