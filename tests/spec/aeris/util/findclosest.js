define([
  'aeris/util',
  'aeris/util/findclosest'
], function(_, findClosest) {
  describe('findClosest', function() {

    it('should return the closest number (target is below range)', function() {
      expect(findClosest(1, [10, 20, 30, 40])).toEqual(10);
    });

    it('should return the closest number (target is below range)', function() {
      expect(findClosest(50, [10, 20, 30, 40])).toEqual(40);
    });

    it('should return the closest number (target is in middle of range)', function() {
      var numbers = [10, 20, 30, 40];
      expect(findClosest(11, numbers)).toEqual(10);
      expect(findClosest(16, numbers)).toEqual(20);
    });

    it('should work with negative numbers', function() {
      var numbers = [-10, 0, 10, 20];

      expect(findClosest(-7, numbers)).toEqual(-10);
      expect(findClosest(-1, numbers)).toEqual(0);
      expect(findClosest(1, numbers)).toEqual(0);
      expect(findClosest(6, numbers)).toEqual(10);
    });

    it('should work with a single number', function() {
      expect(findClosest(1234, [7])).toEqual(7);
      expect(findClosest(-1234, [7])).toEqual(7);
    });

    it('should work when the target is on the array of numbers', function() {
      var numbers = [1, 7, 32, 87];

      numbers.forEach(function(n) {
        expect(findClosest(n, numbers)).toEqual(n);
      });
    });

    it('should work with numbers not in order', function() {
      var numbers = [13, 7, 293, 6, -12];

      expect(findClosest(6.9, numbers)).toEqual(7);
      expect(findClosest(6.4, numbers)).toEqual(6);
      expect(findClosest(0, numbers)).toEqual(6);
      expect(findClosest(-7, numbers)).toEqual(-12);
    });

    it('should not change the original array', function() {
      var numbers = _.range(10, 100, 10);

      findClosest(37, numbers);

      expect(numbers).toEqual(_.range(10, 100, 10));
    });


    // This isn't reliable enough to allow
    // it to break a build.
    // But if you want to test performance,
    // you can reenable it temporarily.
    xit('should perform well', function() {
      var startTime, endTime;
      var ITERATIONS = 1000;
      var NUMBERS_COUNT = 100;
      var numbersSet = [];
      var targets = [];

      if (!performance || !performance.now) {
        return;
      }

      _.times(ITERATIONS, function(i) {
        var from = -1 * NUMBERS_COUNT / 2;
        var to = NUMBERS_COUNT / 2;
        var target = Math.random() * 100 + Math.random() * 10;
        numbersSet.push(_.range(from, to));
        targets.push(target);
      });

      startTime = performance.now();
      numbersSet.forEach(function(numbers, i) {
        var target = targets[i];
        findClosest(target, numbers);
      });
      endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

  });
});
