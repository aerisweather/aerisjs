define([
  'aeris/util',
  'aeris/util/parseobjectvalues'
], function(_, parseObjectValues) {

  describe('parseObjectValues', function() {

    it('should parse strings', function() {
      expect(parseObjectValues('NaN')).toBeNaN();
      expect(parseObjectValues('undefined')).toEqual(undefined);
      expect(parseObjectValues('null')).toEqual(null);
      expect(parseObjectValues('true')).toEqual(true);
      expect(parseObjectValues('false')).toEqual(false);
      expect(parseObjectValues('17')).toEqual(17);
      expect(parseObjectValues('17.5')).toEqual(17.5);
    });

    it('should parse arrays', function() {
      expect(parseObjectValues(
        ['true', 'false', '17']
      )).toEqual([true, false, 17]);
    });

    it('should parse objects', function() {
      expect(parseObjectValues(
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
      expect(parseObjectValues(
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
      expect(parseObjectValues(
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
      expect(parseObjectValues(
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
      expect(parseObjectValues(
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

      expect(parseObjectValues(deepObject)).toEqual(parsedObj);
    });

  });

});
