define([
  'aeris/util',
  'api/params/model/params',
  'aeris/model'
], function(_, Params, Model) {

  function TestFactory() {
    this.params = new Params();
  }


  describe('A Params model', function() {
    
    describe('validation', function() {
      it('should require \'to\' to be a date', function() {
        var test = new TestFactory();

        expect(function() {
          test.params.set('to', { foo: 'bar' }, { validate: true });
        }).toThrowType('ValidationError');

        // Should not throw error
        test.params.set('to', new Date(), { validate: true });
      });
      
      it('should not require \'to\' to be set', function() {
        var test = new TestFactory();

        test.params.set('to', undefined);

        // Should not throw error
        test.params.isValid();
      });

      it('should require \'from\' to be a date', function() {
        var test = new TestFactory();

        expect(function() {
          test.params.set('from', { foo: 'bar' }, { validate: true });
        }).toThrowType('ValidationError');

        // Should not throw error
        test.params.set('from', new Date(), { validate: true });
      });

      it('should not require \'from\' to be set', function() {
        var test = new TestFactory();

        test.params.set('from', undefined);

        // Should not throw error
        test.params.isValid();
      });
    });


    describe('toJSON', function() {

      it('should convert date objects to UNIX timestamps', function() {
        var params = new Params({
          someTime: new Date('March 8, 1987').setMilliseconds('11'),
          from: new Date('September 9, 1981').setMilliseconds('17'),
          to: new Date('November 21, 2013').setMilliseconds('23')
        });

        var json = params.toJSON();

        expect(json.someTime).toEqual(542181601);
        expect(json.from).toEqual(368859601);
        expect(json.to).toEqual(1385013601);
      });

      it('should convert the filters attribute to string', function() {
        var mockFilter = new Model();
        var params = new Params({
          filter: mockFilter
        });

        mockFilter.toString = jasmine.createSpy('mockFilter.toString').
          andReturn('foo/bar');

        expect(params.toJSON().filter).toEqual('foo/bar');
      });

      it('should not require a filters attribute to be set', function() {
        var params = new Params({
          filter: undefined
        });

        // Should not throw error
        params.toJSON();
      });

      it('should convert the \'p\' param to a comma-separated string', function() {
        var params = new Params({
          p: [45, -90]
        });

        expect(params.toJSON().p).toEqual('45,-90');
      });

      it('should not require a \'p\' param to be set', function() {
        var params = new Params({
          p: undefined
        });

        // Should not throw error
        params.toJSON();
      });

      it('should convert the query param to the Aeris query format', function() {
        var params = new Param({
          query: {
            'place.name': 'Seattle',
            'ob.hail.prob': '40:80',
            'ob.hail.prob': '!0'
          }
        })
      });

      it('should not require a query param', function() {
        throw new UntestedSpecError();
      });

    });
    
  });

});
