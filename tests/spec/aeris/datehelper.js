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

      it('should return the date helper', function() {
        var test = new TestFactory();

        var ret = test.helper.addMilliseconds(5);

        // Returns the date helper object
        expect(ret).toEqual(test.helper);

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
        expect(ret).toEqual(test.helper);

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

        expect(ret).toEqual(test.helper);

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

        // Returns the date helper object
        expect(ret).toEqual(test.helper);

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

        // Returns the date helper object
        expect(ret).toEqual(test.helper);

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

        // Returns the date helper object
        expect(ret).toEqual(test.helper);

        // Date is modified
        expect(test.date.getTime()).not.toEqual(test.startTime);
      });

    });

    describe('addTime', function() {
      var test, dateHelper;

      beforeEach(function() {
        test = new TestFactory();
        dateHelper = test.helper;

        spyOn(dateHelper, 'addHours').andReturn(dateHelper);
        spyOn(dateHelper, 'addMinutes').andReturn(dateHelper);
        spyOn(dateHelper, 'addSeconds').andReturn(dateHelper);
        spyOn(dateHelper, 'addMilliseconds').andReturn(dateHelper);
      });

      it('should add hours, minutes, seconds, and milliseconds', function() {
        dateHelper.addTime(1, 2, 3, 4);

        expect(dateHelper.addHours).toHaveBeenCalledWith(1);
        expect(dateHelper.addMinutes).toHaveBeenCalledWith(2);
        expect(dateHelper.addSeconds).toHaveBeenCalledWith(3);
        expect(dateHelper.addMilliseconds).toHaveBeenCalledWith(4);
      });

      it('should only require the hours argument', function() {
        dateHelper.addTime(1);

        expect(dateHelper.addHours).toHaveBeenCalledWith(1);
      });

      it('should accept negative values', function() {
        dateHelper.addTime(-1, -2, -3, -4);

        expect(dateHelper.addHours).toHaveBeenCalledWith(-1);
        expect(dateHelper.addMinutes).toHaveBeenCalledWith(-2);
        expect(dateHelper.addSeconds).toHaveBeenCalledWith(-3);
        expect(dateHelper.addMilliseconds).toHaveBeenCalledWith(-4);
      });

      it('should return the DateHelper instance', function() {
        expect(dateHelper.addTime(1, 2, 3, 4)).toEqual(dateHelper);
      });

    });

    describe('setDate', function() {
      var dateHelper;

      beforeEach(function() {
        dateHelper = new DateHelper();
      });


      it('should return the dateHelper', function() {
        expect(dateHelper.setDate(new Date())).toEqual(dateHelper);
      });

      it('should set the date', function() {
        var date = new Date();

        dateHelper.setDate(date);

        expect(dateHelper.getDate()).toEqual(date);
      });

    });


  });

});
