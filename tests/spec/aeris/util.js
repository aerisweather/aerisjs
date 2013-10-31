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


    describe('boundsToPolygon', function() {

      it('should convert a bounds object to a polygon object', function() {
        var bounds = [[52.37, -135.52], [22.43, -55.016]];
        expect(_.boundsToPolygon(bounds)).toEqual([52.37, -135.52, 22.43, -55.016]);
      });

      it('should not modify the original object', function() {
        var bounds = [[52.37, -135.52], [22.43, -55.016]];
        _.boundsToPolygon(bounds);
        expect(bounds).toEqual([[52.37, -135.52], [22.43, -55.016]]);
      });

    });

    describe('path', function() {

      it('should return a property of an object', function() {
        var obj = {
          foo: 'bar'
        };

        expect(_.path('foo', obj)).toEqual('bar');
      });

      it('should return a nested property of an object', function() {
        var obj = {
          foo: {
            bar: 'yo'
          }
        };

        expect(_.path('foo.bar', obj)).toEqual('yo');
      });

      it('should return a deep nested property of an object', function() {
        var obj = {
          foo: {
            bar: {
              yo: 'jo'
            }
          }
        };

        expect(_.path('foo.bar.yo', obj)).toEqual('jo');
      });

      it('should default to looking in the global scope (window)', function() {
        obj_orig = window.obj;
        window.obj = {
          foo: {
            bar: {
              yo: 'jo'
            }
          }
        };

        expect(_.path('obj.foo.bar.yo')).toEqual('jo');

        window.obj = obj_orig;
      });

      it('should return undefined if no property exists', function() {
        var obj = {
          foo: {
            bar: {
              yo: 'jo'
            }
          }
        };

        expect(_.path('yolo', obj)).toEqual(undefined);
        expect(_.path('foo.yolo', obj)).toEqual(undefined);
        expect(_.path('foo.bar.yolo', obj)).toEqual(undefined);
        expect(_.path('foo.bar.yo.yolo', obj)).toEqual(undefined);
        expect(_.path('foo.bar.yo.somethingelse.yolo', obj)).toEqual(undefined);
        expect(_.path('foo.bar.yo.somethingelse.andmore.yolo', obj)).toEqual(undefined);
        expect(_.path('nada.yada.tada', obj)).toEqual(undefined);
      });

    });

    describe('isNumeric', function() {

      it('should return true for numeric objects', function() {
        expect(_.isNumeric(123)).toEqual(true);
        expect(_.isNumeric('123')).toEqual(true);
      });

      it('should return false for non-numberic objects', function() {
        expect(_.isNumeric('foo')).toEqual(false);
        expect(_.isNumeric('10px')).toEqual(false);
        expect(_.isNumeric('')).toEqual(false);
        expect(_.isNumeric({ foo: 'bar' })).toEqual(false);
        expect(_.isNumeric([{name: 'FireMarkers'}])).toEqual(false);
        expect(_.isNumeric(new Date())).toEqual(false);
      });

    });

    describe('container', function() {

      it('should return true if the array contains the value', function() {
        expect(_(['a', 'b', 'c']).contains('a')).toEqual(true);
      });

      it('should return false if the array does not contain the value', function() {
        expect(_(['a', 'b', 'c']).contains('x')).toEqual(false);
      });

    });

    describe('parseObjectValues', function() {

      it('should parse strings', function() {
        expect(_.parseObjectValues('NaN')).toBeNaN();
        expect(_.parseObjectValues('undefined')).toEqual(undefined);
        expect(_.parseObjectValues('null')).toEqual(null);
        expect(_.parseObjectValues('true')).toEqual(true);
        expect(_.parseObjectValues('false')).toEqual(false);
        expect(_.parseObjectValues('17')).toEqual(17);
        expect(_.parseObjectValues('17.5')).toEqual(17.5);
      });

      it('should parse arrays', function() {
        expect(_.parseObjectValues(
          ['true', 'false', '17']
        )).toEqual([true, false, 17]);
      });

      it('should parse objects', function() {
        expect(_.parseObjectValues(
          {
            boolTrue: 'true',
            boolFalse: 'false',
            num: '17',
            str: 'foo'
          }
        )).toEqual(
          {
            boolTrue: true,
            boolFalse: false,
            num: 17,
            str: 'foo'
          }
        );
      });

      it('should parse objects nested in arrays', function() {
        expect(_.parseObjectValues(
          [
            {
              boolTrue: 'true',
              boolFalse: 'false',
              num: '17',
              str: 'foo'
            }
          ]
        )).toEqual(
          [
            {
              boolTrue: true,
              boolFalse: false,
              num: 17,
              str: 'foo'
            }
          ]
        );
      });

      it('should parse arrays nested in objects', function() {
        expect(_.parseObjectValues(
          {
            parentObj: ['true', 'false', '17']
          }
        )).toEqual(
          {
            parentObj: [true, false, 17]
          }
        );
      });

      it('should parse arrays nested in arrays', function() {
        expect(_.parseObjectValues(
          [
            ['true', 'false', '17']
          ]
        )).toEqual(
          [
            [true, false, 17]
          ]
        );
      });

      it('should parse objects nested in objects', function() {
        expect(_.parseObjectValues(
          {
            obj: {
              boolTrue: 'true',
              boolFalse: 'false',
              num: '17',
              str: 'foo'
            }
          }
        )).toEqual(
          {
            obj: {
              boolTrue: true,
              boolFalse: false,
              num: 17,
              str: 'foo'
            }
          }
        );
      });

      it('should parse deep nested jungles', function() {
        var deepObject = {
          num: '18.5',
          arr: [
            'true',
            {
              obj: {
                boolFalse: 'false',
                nums: ['16.5', 82, '19.001']
              }
            }
          ],
          obj: {
            str: 'str',
            boolTrue: 'true',
            boolTrueReal: true,
            nums: {
              numsA: [22, '15'],
              numsB: [18, {
                num: '-96.15'
              }]
            }
          }
        };
        var parsedObj = {
          num: 18.5,
          arr: [
            true,
            {
              obj: {
                boolFalse: false,
                nums: [16.5, 82, 19.001]
              }
            }
          ],
          obj: {
            str: 'str',
            boolTrue: true,
            boolTrueReal: true,
            nums: {
              numsA: [22, 15],
              numsB: [18, {
                num: -96.15
              }]
            }
          }
        };

        expect(_.parseObjectValues(deepObject)).toEqual(parsedObj);
      });
      
    });
    
    describe('extendArrayObjects', function() {
      
      it('should require arrays as arguments', function() {
        expect(function() {
          _.extendArrayObjects('foo', []);
        }).toThrow();
        expect(function() {
          _.extendArrayObjects([], 'foo');
        }).toThrow();
      });

      it('should replace itemB with itemA, if one or both are not object', function() {
        var arrA = [
          { foo: 'bar' },
          'arrA'
        ];
        var arrB = [
          'arrB',
          { hello: 'world' }
        ];
        expect(_.extendArrayObjects(arrA, arrB)).toEqual(['arrB', { hello: 'world' }]);
      });

      it('should add items from arrB, if arrA is shorter in length', function() {
        var arrA = [
          'a',
          'b',
          'c'
        ];
        var arrB = [
          1,
          2,
          3,
          4,
          5
        ];
        expect(_.extendArrayObjects(arrA, arrB)).toEqual([
          1,
          2,
          3,
          4,
          5
        ]);
      });

      it('should extend items, if both are objects', function() {
        var arrA = [
          {
            foo: 'bar',
            hello: 'world'
          },
          {
            yaz: 'shazaam'
          }
        ];
        var arrB = [
          {
            hello: 'universe',
            yipee: 'kayo-kayai'
          },
          {
            yowza: 'wazaam'
          }
        ];

        expect(_.extendArrayObjects(arrA, arrB)).toEqual([
          {
            foo: 'bar',
            hello: 'universe',
            yipee: 'kayo-kayai'
          },
          {
            yaz: 'shazaam',
            yowza: 'wazaam'
          }
        ]);
      });

      it('should not change the original arrays', function() {
        var arrA = [
          {
            foo: 'bar',
            hello: 'world'
          },
          {
            yaz: 'shazaam'
          }
        ];
        var arrB = [
          {
            hello: 'universe',
            yipee: 'kayo-kayai'
          },
          {
            yowza: 'wazaam'
          }
        ];
        _.extendArrayObjects(arrA, arrB);

        expect(arrA).toEqual([
          {
            foo: 'bar',
            hello: 'world'
          },
          {
            yaz: 'shazaam'
          }
        ]);

        expect(arrB).toEqual([
          {
            hello: 'universe',
            yipee: 'kayo-kayai'
          },
          {
            yowza: 'wazaam'
          }
        ]);
      });
      
    });

    describe('extendFactorySpec', function() {
      /** @constant */
      var SPEC_ORIG = {
        create: {
          module: 'base/module',
          args: [
            'a',
            {
              foo: 'bar',
              hello: 'world'
            }
          ]
        },
        properties: {
          propA: 'valA',
          propB: 'valB'
        }
      };
      function getSpec() {
        return {
          create: {
            module: 'base/module',
            args: [
              'a',
              {
                foo: 'bar',
                hello: 'world'
              }
            ]
          },
          properties: {
            propA: 'valA',
            propB: 'valB'
          }
        }
      }

      it('should maintain the factory module', function() {
        var ext = {
          create: {
            args: ['a', 'b', 'c']
          }
        };
        expect(_.extendFactorySpec(getSpec(), ext).create.module).toEqual('base/module');
      });

      it('should override the factory module', function() {
        var ext = {
          create: {
            module: 'ext/module'
          }
        };

        expect(_.extendFactorySpec(getSpec(), ext).create.module).toEqual('ext/module');
      });

      it('should override other spec properties', function() {
        var ext = {
          properties: {
            propA: 'valA_ext',
            foo: 'bar'
          },
          someOther: 'spec property'
        };

        expect(_.extendFactorySpec(getSpec(), ext).properties).toEqual({
          propA: 'valA_ext',
          foo: 'bar'
        });
        expect(_.extendFactorySpec(getSpec(), ext).someOther).toEqual('spec property');
      });

      it('should maintain other spec properties', function() {
        var ext = {
          create: {
            args: ['a', 'b']
          }
        };

        expect(_.extendFactorySpec(getSpec(), ext).properties).toEqual({
          propA: 'valA',
          propB: 'valB'
        });
      });

      it('should extend the factory arguments', function() {
        var ext = {
          create: {
            args: [
              { yo: 'jo' },
              {
                hello: 'universe',
                hey: 'ho'
              },
              42
            ]
          }
        };

        expect(_.extendFactorySpec(getSpec(), ext).create.args).toEqual([
          { yo: 'jo' },
          {
            foo: 'bar',
            hello: 'universe',
            hey: 'ho'
          },
          42
        ]);
      });

      it('should return a new object (and not change the original objects)', function() {
        var ext = {
          module: 'ext/module',
          args: [
            'x',
            {
              hello: 'universe'
            }
          ]
        };

        _.extendFactorySpec(getSpec(), ext);

        expect(ext).toEqual({
          module: 'ext/module',
          args: [
            'x',
            {
              hello: 'universe'
            }
          ]
        });
        expect(getSpec()).toEqual(SPEC_ORIG);
      });

    });

  });
});
