define([
  'aeris/util',
  'jasmine'
], function(_) {
  /**
   * Spies on all methods of an object.
   * Methods are all called through.
   *
   * @param {Object} obj
   * @method spyOnObject
   */
  var spyOnObject = function(obj) {
    _.each(obj, function(val, key) {
      if (_.isFunction(val)) {
        spyOn(obj, key).andCallThrough();
      }
    });
  };

  return spyOnObject;
});
