define([
  'sinon',
  'aeris/util'
], function(sinon, _) {
  describe('The Aeris Utility Library', function() {
    it('should provide unique ids', function() {
      var uuids = [];

      for (var i = 0; i < 50; i++) {
        var id = _.uniqueId();
        expect(uuids.indexOf(id)).toEqual(-1);

        uuids.push(id);
      }

      for (var i = 0; i < 50; i++) {
        var id = _.uniqueId('somePrefix');
        expect(uuids.indexOf(id)).toEqual(-1);

        uuids.push(id);
      }
    });

    describe('should convert latLon to degrees', function() {

      it('standard use case', function() {
        var latLon = [45.1234567, -90.1234567];

        var degrees = _.latLonToDegrees(latLon);
        var latDeg = degrees[0][0];
        var latMin = degrees[0][1];
        var latSec = degrees[0][2];
        var lonDeg = degrees[1][0];
        var lonMin = degrees[1][1];
        var lonSec = degrees[1][2];

        expect(latDeg).toEqual(45);
        expect(latMin).toEqual(7);
        expect(latSec).toBeNear(24.4452, 0.0025);

        expect(lonDeg).toEqual(-90);
        expect(lonMin).toEqual(7);
        expect(lonSec).toBeNear(24.4452, 0.0025);
      });

      it('zeros', function() {
        var latLon = [0, 0];
        expect(_.latLonToDegrees(latLon)).toEqual([
          [0, 0, 0],
          [0, 0, 0]
        ]);
      });
    });

    describe('should convert degrees to latLon', function() {
      it('standard use case', function() {
        var degrees = [
          [45, 7, 24.4452],
          [-90, 7, 24.4452]
        ];
        var latLon = _.degreesToLatLon(degrees);
        var precision = Math.pow(10, -6);

        expect(latLon[0]).toBeNear(45.1234567, precision);
        expect(latLon[1]).toBeNear(-90.1234567, precision);
      });

      it('zeros', function() {
        var degrees = [
          [0, 0, 0],
          [0, 0, 0]
        ];
        expect(_.degreesToLatLon(degrees)).toEqual([0, 0]);
      });
    });


    describe('expose method', function() {
      var aeris_orig = window.aeris;

      afterEach(function() {
        window.aeris = aeris_orig;
      });

      it('should expose variables under the aeris namespace', function() {
        var foo = 'bar';

        _.expose(foo, 'aeris.foo');

        expect(window.aeris.foo).toEqual(foo);
      });

      it('should return the exposed variable', function() {
        var foo = 'bar';
        expect(_.expose(foo, 'aeris.foo')).toEqual(foo);
      });

      it('should expose variables under sub-namespaces', function() {
        var foo = 'bar';

        _.expose(foo, 'aeris.someNs.foo');

        expect(window.aeris.someNs.foo).toEqual(foo);
      });

      it('should extend existing namespaces', function() {
        var foo = 'bar';

        window.aeris = {};
        window.aeris.someNs = { already: 'here' };

        _.expose(foo, 'aeris.someNs.foo');

        expect(window.aeris.someNs).toEqual({
          already: 'here',
          foo: 'bar'
        });
      });

      it('should not overwrite existing objects', function() {
        var foo = 'bar';

        window.aeris.foo = 'notBar';

        _.expose(foo, 'aeris.foo', false);

        expect(window.aeris.foo).toEqual('notBar');
      });

      it('should not expose globals outside of the aeris namespace', function() {
        expect(function() {
          _.expose('not a jQuery plugin', '$.fn.superAwesomePluginIPromise');
        }).toThrow();
      });
    });


    describe('provide method', function() {
      var aeris_orig = window.aeris;

      afterEach(function() {
        window.aeris = aeris_orig;
      });

      it('should expose an empty namespace', function() {
        var ret;

        spyOn(_, 'expose');

        _.provide('aeris.foo.bar');

        expect(_.expose).toHaveBeenCalledWith({}, 'aeris.foo.bar', false);
      });

      it('should return the value from the expose method', function() {
        var ret;
        var val = 'something';

        spyOn(_, 'expose').andReturn(val);

        expect(_.provide('aeris.foo.bar')).toEqual(val);
      });
    });

    describe('average', function() {
      it('should return the average of an array of numbers', function() {
        var arr = [
          5,
          10,
          15,
          25,
          30
        ];

        expect(_.average(arr)).toEqual(17);
      });

      it('should reject non-arrays, or arrays which contain non-numbers', function() {
        var nonArrays = [
          'foo',
          null,
          12345,
          new Date(),
          [
            'foo',
            17,
            32
          ]
        ];

        _.each(nonArrays, function(bad) {
          expect(_.bind(_.average, _, bad)).toThrow();
        });
      });
    });

    describe('delay', function() {
      var clock, fn;

      beforeEach(function() {
        clock = sinon.useFakeTimers();
        fn = jasmine.createSpy('fn');
      });

      afterEach(function() {
        clock.restore();
      });

      it('should call the function in a given context', function() {
        var ctx = { foo: 'bar' };
        var wait = 200;

        _.delay(fn, wait, ctx, 'yo', 'hey');

        expect(fn).not.toHaveBeenCalled();

        clock.tick(210);
        expect(fn).toHaveBeenCalledInTheContextOf(ctx);
        expect(fn).toHaveBeenCalledWith('yo', 'hey');
      });
    });

    describe('interval', function() {
      var clock, fn;

      beforeEach(function() {
        clock = sinon.useFakeTimers();
        fn = jasmine.createSpy('fn');
      });

      afterEach(function() {
        clock.restore();
      });

      it('should work like window.setInterval, but better', function() {
        var ctx = { foo: 'bar' };
        var wait = 200;

        var interval = _.interval(fn, wait, ctx, 'yo', 'hey');

        expect(fn).not.toHaveBeenCalled();

        clock.tick(200);
        expect(fn).toHaveBeenCalledInTheContextOf(ctx);
        expect(fn).toHaveBeenCalledWith('yo', 'hey');

        clock.tick(200);
        expect(fn.callCount).toEqual(2);

        window.clearInterval(interval);
        clock.tick(200);
        expect(fn.callCount).toEqual(2);
      });
    });

  });
});
