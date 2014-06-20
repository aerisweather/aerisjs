define(function() {
  /**
   * Find the number closet to a target number.
   *
   * @method findCloset
   * @namespace aeris.util
   *
   * @param {number} target
   * @param {Array.<number>} numbers
   */
  return function findClosest(target, numbers) {
    var numbersInOrderOfDistance = numbers.sort(function(a, b) {
      var isAMoreDistantThanB = isMoreDistantThan(a, b, target);

      if (isAMoreDistantThanB) {
        return 1;
      }
      else {
        return -1;
      }
    });

    return numbersInOrderOfDistance[0];
  }

  function getDistance(a, b) {
    return Math.abs(a - b);
  }

  /**
   *
   * @param {Number} a
   * @param {Number} b
   * @param {Number} target
   * @return {Boolean} Returns true if 'a' is more distant than 'b' from target.
   */
  function isMoreDistantThan(a, b, target) {
    var aDistanceFromTarget = getDistance(a, target);
    var bDistanceFromTarget = getDistance(b, target);

    return aDistanceFromTarget > bDistanceFromTarget;
  }
});
