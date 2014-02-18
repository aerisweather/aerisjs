define([
  'aeris/util',
  'aeris/datehelper'
], function(_, DateHelper) {
  var MILLISECOND = 1;
  var SECOND = MILLISECOND * 1000;
  var MINUTE = SECOND * 60;
  var HOUR = MINUTE * 60;
  var DAY = HOUR * 24;
  var WEEK = DAY * 7;

  function TestFactory(opt_options) {
    var options = _.extend({
      time: 100
    }, opt_options);

    this.date = new Date(options.time);

    this.startTime = options.time;

    this.helper = new DateHelper(this.date);
  };

  describe('A DateHelper', function() {

    describe('addMilleseconds', function() {

      it('should add milleseconds to the date', function() {
        var test = new TestFactory();

        test.helper.addMilliseconds(5);

        expect(test.date.getTime()).toEqual(test.startTime + (5 * MILLISECOND));
      });

      it('should return the modified date object', function() {
        var test = new TestFactory();

        var ret = test.helper.addMilliseconds(5);

        // Returns the date object
        expect(ret).toEqual(test.date);

        // Date is modified
        expect(test.date.getTime()).not.toEqual(test.startTime);
      });

    });

    describe('addSeconds', function() {

      it('should add seconds to the date', function() {
        var test = new TestFactory();

        test.helper.addSeconds(5);

        expect(test.date.getTime()).toEqual(test.startTime + (5 * SECOND));
      });

      it('should return the modified date object', function() {
        var test = new TestFactory();

        var ret = test.helper.addSeconds(5);

        // Returns the date object
        expect(ret).toEqual(test.date);

        // Date is modified
        expect(test.date.getTime()).not.toEqual(test.startTime);
      });

    });

    describe('addMinutes', function() {

      it('should add minutes to the date', function() {
        var test = new TestFactory();

        test.helper.addMinutes(5);

        expect(test.date.getTime()).toEqual(test.startTime + (5 * MINUTE));
      });

      it('should return the modified date object', function() {
        var test = new TestFactory();

        var ret = test.helper.addMinutes(5);

        // Returns the date object
        expect(ret).toEqual(test.date);

        // Date is modified
        expect(test.date.getTime()).not.toEqual(test.startTime);
      });

    });

    describe('addHours', function() {

      it('should add hours to the date', function() {
        var test = new TestFactory();

        test.helper.addHours(5);

        expect(test.date.getTime()).toEqual(test.startTime + (5 * HOUR));
      });

      it('should return the modified date object', function() {
        var test = new TestFactory();

        var ret = test.helper.addHours(5);

        // Returns the date object
        expect(ret).toEqual(test.date);

        // Date is modified
        expect(test.date.getTime()).not.toEqual(test.startTime);
      });

    });

    describe('addDays', function() {

      it('should add hours to the date', function() {
        var test = new TestFactory();

        test.helper.addDays(5);

        expect(test.date.getTime()).toEqual(test.startTime + (5 * DAY));
      });

      it('should return the modified date object', function() {
        var test = new TestFactory();

        var ret = test.helper.addDays(5);

        // Returns the date object
        expect(ret).toEqual(test.date);

        // Date is modified
        expect(test.date.getTime()).not.toEqual(test.startTime);
      });

    });

    describe('addWeeks', function() {

      it('should add days to the date', function() {
        var test = new TestFactory();

        test.helper.addWeeks(5);

        expect(test.date.getTime()).toEqual(test.startTime + (5 * WEEK));
      });

      it('should return the modified date object', function() {
        var test = new TestFactory();

        var ret = test.helper.addWeeks(5);

        // Returns the date object
        expect(ret).toEqual(test.date);

        // Date is modified
        expect(test.date.getTime()).not.toEqual(test.startTime);
      });

    });

  });

});
