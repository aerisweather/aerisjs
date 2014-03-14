define([
  'aeris/util',
  'aeris/helpers/validator/abstractvalidator',
  'aeris/errors/validationerror'
], function(_, AbstractValidator, ValidationError) {
  /**
   * Validates bounds defined by latLon coordinates.
   *
   * @class BoundsValidator
   * @namespace aeris.helpers.validator
   * @extends aeris.helpers.validator.AbstractValidator
   *
   * @constructor
   * @override
  */
  var BoundsValidator = function(bounds) {
    this.bounds_ = bounds;

    AbstractValidator.apply(this, arguments);
  };
  _.inherits(BoundsValidator, AbstractValidator);


  /**
   * @method isValid
   */
  BoundsValidator.prototype.isValid = function() {
    var validationError = null;

    this.clearLastError_();

    function proposeError(error) {
      validationError || (validationError = error);
    }

    proposeError(this.validateArea_());

    if (!this.hasCoordinates_()) {
      proposeError(this.createValidationError_('Invalid bounds coordinates'));
    }

    this.setLastError_(validationError);
    return !validationError;
  };


  BoundsValidator.prototype.createValidationError_ = function(msg) {
    return new ValidationError('bounds', msg);
  };


  BoundsValidator.prototype.hasCoordinates_ = function() {
    return _.isArray(this.getSW_()) && _.isArray(this.getNE_());
  };


  BoundsValidator.prototype.validateArea_ = function() {
    var area;
    var validationError = null;

    try {
      area = this.getAreaOfBounds_();
    }
    catch (err) {
      var areaErrorMessage = 'Unable to calculate bounds area: ' + err.message;
      validationError = validationError || this.createValidationError_(areaErrorMessage);
    }

    if (!area || area <= 0) {
      validationError = validationError || this.createValidationError_('Bounds must define an area.');
    }

    return validationError;
  };


  BoundsValidator.prototype.getSW_ = function() {
    return this.bounds_[0];
  };


  BoundsValidator.prototype.getNE_ = function() {
    return this.bounds_[1];
  };


  BoundsValidator.prototype.getAreaOfBounds_ = function() {
    var sw, ne, height, width;

    sw = this.bounds_[0];
    ne = this.bounds_[1];

    height = Math.abs(ne[0] - sw[0]);
    width = Math.abs(ne[1] - sw[1]);

    return width * height;
  };


  return BoundsValidator;
});
