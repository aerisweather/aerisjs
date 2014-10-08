define([
  'aeris/util',
  'aeris/maps/markers/lightningmarker',
  'aeris/model',
  'tests/lib/clock'
], function(_, LightningMarker, Model, clock) {

  describe('LightningMarker', function() {

    describe('attribute transforms', function() {


      describe('type', function() {
        var lightningMarker, dataModel, lightningStyles;

        beforeEach(function() {
          lightningStyles = {
            10: {},
            20: {},
            30: {},
            9999: {}
          };
          dataModel = new Model();
          lightningMarker = new LightningMarker(null, {
            data: dataModel,
            iconLookup: lightningStyles
          });
        });

        beforeEach(function() {
          clock.useFakeTimers(1e5);
        });
        afterEach(function() {
          clock.restore();
        });


        function getMinutesAgo(minutesAgo) {
          var millisecondsAgo = minutesAgo * 60 * 1000;

          return Date.now() - millisecondsAgo;
        }

        function getMinutesAgoUnix(minutesAgo) {
          return getMinutesAgo(minutesAgo) / 1000;
        }

        it('it should return the next highest minutes ago, from the icon lookup keys', function() {


          dataModel.set('obTimestamp', getMinutesAgoUnix(5));
          expect(lightningMarker.getType()).toEqual(10);

          dataModel.set('obTimestamp', getMinutesAgoUnix(11));
          expect(lightningMarker.getType()).toEqual(20);

          dataModel.set('obTimestamp', getMinutesAgoUnix(20));
          expect(lightningMarker.getType()).toEqual(20);

          dataModel.set('obTimestamp', getMinutesAgoUnix(31));
          expect(lightningMarker.getType()).toEqual(9999);
        });

      });

    });

  });

});
