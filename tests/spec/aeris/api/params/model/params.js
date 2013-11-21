define([
  'aeris/util',
  'api/params/model/params',
  'aeris/model'
], function(_, Params, Model) {

  function TestFactory() {
    this.params = new Params();
  }


  describe('A Params model', function() {

    describe('constructor', function() {

      it('should trigger change events when query parameters change', function() {
        var query = new Model();
        var params = new Params({
          query: query
        });
        var listeners = jasmine.createSpyObj('listeners', [
          'change',
          'changeAttr'
        ]);

        params.on('change', listeners.change);
        params.on('change:query', listeners.changeAttr);

        query.set('value', 'foo');
        expect(listeners.change.callCount).toEqual(1);
        expect(listeners.changeAttr.callCount).toEqual(1);
      });

      it('should trigger change events when the query attribute is overwritten', function() {
        var queryA = new Model();
        var queryB = new Model();
        var params = new Params({
          query: queryA
        });

        var listeners = jasmine.createSpyObj('listeners', [
          'change',
          'changeAttr'
        ]);

        params.set('query', queryB);

        params.on('change', listeners.change);
        params.on('change:query', listeners.changeAttr);

        // Old query model change -->
        // params shouldn't trigger change
        queryA.set('value', 'foo');
        expect(listeners.change).not.toHaveBeenCalled();
        expect(listeners.changeAttr).not.toHaveBeenCalled();

        // New query model changes -->
        // params should trigger chnage
        queryB.set('value', 'foo');
        expect(listeners.change.callCount).toEqual(1);
        expect(listeners.changeAttr.callCount).toEqual(1);
      });

      it('should not require a query parameter', function() {
        // Should throw error
        new Params();
      });

    });


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

      it('should require \'query\' to be a model', function() {
        expect(function() {
          var params = new Params({
            query: 'foo'
          });

          params.isValid();
        }).toThrowType('ValidationError');
      });

      it('should not requre \'query\' to be set', function() {
        var params = new Params({
          query: undefined
        });

        // Should not throw error
        params.isValid();
      });
    });


    describe('toJSON', function() {

      it('should convert date objects to UNIX timestamps', function() {
        var dates = {
          someTime: new Date('March 8, 1987'),
          from: new Date('September 9, 1981'),
          to: new Date('November 21, 2013')
        };

        var params, json;

        // Add some ms onto each date,
        // so we can check that toJSON
        // returns whole numbers.
        _.each(dates, function(d) {
          d.setMilliseconds('11');
        });

        params = new Params(dates);
        json = params.toJSON();

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
        var query = new Model();
        var params = new Params({
          query: query
        });

        spyOn(query, 'toString').andReturn('foo:bar;foo:shabaaz');

        expect(params.toJSON().query).toEqual('foo:bar;foo:shabaaz');
      });

      it('should not require a query param', function() {
        var params = new Params({
          query: undefined
        });

        // Should not throw error
        params.toJSON();
      });

    });

  });

});
