define([
  'aeris/util',
  'helpers/validator/abstractvalidator',
  'helpers/validator/pathvalidator',
  'directions/errors/invaliddirectionsresultserror',
  'directions/results/directionsresultsstatus'
], function(_, AbstractValidator, PathValidator, InvalidDirectionsResultsError, DirectionsResultsStatus) {
  /**
   * Validates an {aeris.directions.results.DirectionsResults} object.
   *
   * @class aeris.directions.results.DirectionsResultsValidator
   * @extends aeris.helpers.validator.AbstractValidator
   * @implements aeris.helpers.validator.ValidatorInterface
   *
   * @constructor
   */
  var DirectionsResultsValidator = function(results) {
    this.results_ = results;
    AbstractValidator.call(this, results);
  };
  _.inherits(DirectionsResultsValidator, AbstractValidator);


  /** @return {Boolean} */
  DirectionsResultsValidator.prototype.isValid = function() {
    this.clearLastError_();

    var pathError = this.getPathError_(this.results_.path);
    var statusError = this.getStatusError_(this.results_.status);
    var distanceError = this.getDistanceError_(this.results_.distance);
    var anyError = pathError || statusError || distanceError;

    if (anyError) {
      this.setLastError_(anyError)
    }

    return (!anyError);
  };


  /**
   * @param {Array.<number>} path
   * @return {aeris.directions.errors.InvalidDirectionsResultsError=}
   * @private
   */
  DirectionsResultsValidator.prototype.getPathError_ = function(path) {
    var pathValidator = new PathValidator(path);

    if (!pathValidator.isValid()) {
      return new InvalidDirectionsResultsError(attrs.path + ' is not a valid path.');
    }
  };


  /**
   * @param {Object} status
   * @return {aeris.directions.errors.InvalidDirectionsResultsError=}
   * @private
   */
  DirectionsResultsValidator.prototype.getStatusError_ = function(status) {
    if (!_.isObject(status)) {
      return new InvalidDirectionsResultsError(status + ' is not a valid status.');
    }
    if (!this.isValidStatusCode_(status.code)) {
      return new InvalidDirectionsResultsError(status.code + ' is not a valid status code.');
    }
    if (!_.isString(status.message)) {
      return new InvalidDirectionsResultsError(status.message + ' is not a valid status message');
    }
  };


  /**
   * @param {number} distance
   * @return {aeris.directions.errors.InvalidDirectionsResultsError=}
   * @private
   */
  DirectionsResultsValidator.prototype.getDistanceError_ = function(distance) {
    var isPositiveNumber = _.isNumeric(distance) && distance >= 0;
    var isValid = !_.isNull(distance) && !isPositiveNumber;

    if (isValid) {
      return new InvalidDirectionsResultsError(distance + ' is not a valid distance.');
    }
  };


  /**
   * @param {string} code
   * @return {Boolean}
   * @private
   */
  DirectionsResultsValidator.prototype.isValidStatusCode_ = function(code) {
    return _.contains(DirectionsResultsStatus, code);
  };


  return DirectionsResultsValidator;
});
