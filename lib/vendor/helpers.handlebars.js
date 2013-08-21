define(['vendor/handlebars', 'aeris/util'], function(Handlebars, _) {
  Handlebars.registerHelper('lowercase', function(str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('capitalize', function(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  });

  Handlebars.registerHelper('ternary', function(condition, ifTrue, ifFalse) {
    return condition ? ifTrue : ifFalse;
  });

  Handlebars.registerHelper('toFixed', function(number, places) {
    return number.toFixed(places);
  });


  /**
   * @param {number} coord Floating value coordinates.
   * @return {string} Coordinates as X° Y' Z".
   */
  Handlebars.registerHelper('toDegrees', function(coord) {
    var degrees = _.decimalToDegrees(coord);
    return new Handlebars.SafeString(
      degrees[0].toFixed(0) + '&deg; ' +
      degrees[1].toFixed(0) + '\' ' +
      degrees[2].toFixed(0) + '\"'
    );
  });


  /**
   * Convert meters to miles.
   *
   * @param {number} meters
   * @param {number=} opt_places Number of decimal places to display.
   * @return {string}
   */
  Handlebars.registerHelper('metersToMiles', function(meters, opt_places) {
    var places = _.isNumber(opt_places) ? opt_places : 1;

    return (meters / 1609.34).toFixed(places);
  });

  /**
   * Convert meters to kilometers.
   *
   * @param {number} meters
   * @param {number=} opt_places Number of decimal places to display.
   * @return {string}
   */
  Handlebars.registerHelper('metersToKm', function(meters) {
    var places = _.isNumber(opt_places) ? opt_places : 1;

    return (meters / 1000).toFixed(places);
  });

  /**
   * Convert meters to miles or kilometers
   *
   * @param {number} meters
   * @param {Boolean} opt_isMetric Whether to convert to metric.
   *                                Default is false (converts to US Standard).
   * @param {number=} opt_places Number of decimal places to display.
   *
   * @return {string}
   */
  Handlebars.registerHelper('metersTo', function(meters, opt_isMetric, opt_places) {
    var isMetric = _.isBoolean(opt_isMetric) ? false : opt_isMetric;
    var places = _.isNumber(opt_places) ? opt_places : 1;
    var divisor = isMetric ? 1000 : 1609.34;

    return (meters / divisor).toFixed(places);
  });

  /**
   * Provides equality testing within if statements.
   */
  Handlebars.registerHelper('ifEquals', function(v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
});
