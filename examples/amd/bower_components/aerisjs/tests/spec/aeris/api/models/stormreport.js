define([
  'aeris/util',
  'aeris/api/models/stormreport'
], function(_, StormReport) {

  describe('A StormReport', function() {
    var stormReport;

    beforeEach(function() {
      stormReport = new StormReport();
    });

    describe('testFilter', function() {
      var FILTER_STUB = 'FILTER_STUB';

      it('should return true if the \'stormtypes\' attribute contains the filter', function() {
        stormReport.set('stormtypes', ['foo', FILTER_STUB, 'bar']);

        expect(stormReport.testFilter(FILTER_STUB)).toEqual(true);
      });

      it('should return false if the \'stormtypes\' attribute does not contains the filter', function() {
        stormReport.set('stormtypes', ['foo', 'bar']);

        expect(stormReport.testFilter(FILTER_STUB)).toEqual(false);
      });


    });

  });

});
