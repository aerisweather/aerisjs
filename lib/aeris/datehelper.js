define(function() {
  var MILLISECOND = 1;
  var SECOND = MILLISECOND * 1000;
  var MINUTE = SECOND * 60;
  var HOUR = MINUTE * 60;
  var DAY = HOUR * 24;
  var WEEK = DAY * 7;


  /**
   * Manipulates a {Date} object.
   *
   * @class aeris.DateHelper
   *
   * @param {Date=} opt_date Defaults to current date.
   * @constructor
   */
  var DateHelper = function(opt_date) {
    this.date_ = opt_date || new Date();
  };


  /**
   * @param {number} ms
   * @return {Date} Modified date object.
   */
  DateHelper.prototype.addMilliseconds = function(ms) {
    this.date_.setTime(this.date_.getTime() + ms);

    return this.date_;
  };


  /**
   * @param {number} seconds
   * @return {Date} Modified date object.
   */
  DateHelper.prototype.addSeconds = function(seconds) {
    return this.addMilliseconds(seconds * SECOND);
  };


  /**
   * @param {number} minutes
   * @return {Date} Modified date object.
   */
  DateHelper.prototype.addMinutes = function(minutes) {
    return this.addMilliseconds(minutes * MINUTE);
  };


  /**
   * @param {number} hours
   * @return {Date} Modified date object.
   */
  DateHelper.prototype.addHours = function(hours) {
    return this.addMilliseconds(hours * HOUR);
  };


  /**
   * @param {number} days
   * @return {Date} Modified date object.
   */
  DateHelper.prototype.addDays = function(days) {
    return this.addMilliseconds(days * DAY);
  };


  /**
   * @param {number} weeks
   * @return {Date} Modified date object.
   */
  DateHelper.prototype.addWeeks = function(weeks) {
    return this.addMilliseconds(weeks * WEEK);
  };


  /**
   * @return {Date}
   */
  DateHelper.prototype.getDate = function() {
    return this.date_;
  };


  /**
   * @param {Date} opt_date Defaults to current date.
   */
  DateHelper.prototype.setDate = function(opt_date) {
    this.date_ = opt_date || new Date();
  };


  return DateHelper;
});
