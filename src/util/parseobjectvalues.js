define([
  'aeris/util'
], function(_) {
  /**
   * Parse end-leaf values of deep nested objects,
   * replacing string'ed objects to their
   * primitive values.
   *
   * Useful for processing inputs that are serialized
   * only as strings (eg. forms, querystring routes).
   *
   * eg. {
   *     num: '18.5',
   *     arr: [
   *       'true',
   *       {
   *         obj: {
   *           boolFalse: 'false',
   *           nums: ['16.5', 82, '19.001']
   *         }
   *       }
   *     ],
   *     obj: {
   *       str: 'str',
   *       boolTrue: 'true',
   *       boolTrueReal: true,
   *       nums: {
   *         numsA: [22, '15'],
   *         numsB: [18, {
   *           num: '-96.15'
   *         }]
   *       }
   *     }
   *   }
   * becomes:
   * {
   *     num: 18.5,
   *     arr: [
   *       true,
   *       {
   *         obj: {
   *           boolFalse: false,
   *           nums: [16.5, 82, 19.001]
   *         }
   *       }
   *     ],
   *     obj: {
   *       str: 'str',
   *       boolTrue: true,
   *       boolTrueReal: true,
   *       nums: {
   *         numsA: [22, 15],
   *         numsB: [18, {
   *           num: -96.15
   *         }]
   *       }
   *     }
   *   }
   *
   * @param {string} str
   * @return {*}
   * @method parseObjectValues
   */
  var parseObjectValues = function(str) {
    var arr, obj;

    if (_.isArray(str)) {
      arr = str.slice(0);
      // Parse all array values recursively
      return arr.map(parseObjectValues, this);
    }
    if (_.isObject(str)) {
      obj = _.clone(str);
      // Parse all object values recursively.
      _.each(str, function(val, key) {
        str[key] = parseObjectValues(val);
      }, this);
      return str;
    }

    if (str === 'NaN') {
      return NaN;
    }
    if (str === 'undefined') {
      return undefined;
    }
    if (str === 'null') {
      return null;
    }
    if (str === 'true') {
      return true;
    }
    if (str === 'false') {
      return false;
    }
    if (_.isNumeric(str)) {
      return parseFloat(str);
    }

    return str;
  };

  return parseObjectValues;
});
