define([
  'aeris/util',
  'aeris/api/params/models/params',
  'aeris/model',
  'aeris/collection',
  'aeris/api/params/collections/chainedqueries',
  'mocks/aeris/config',
  'mocks/mockfactory'
], function(_, Params, Model, Collection, ChainedQueries, MockConfig, MockFactory) {

  function TestFactory() {
    this.params = new Params({

    }, { validate: false });
  }


  describe('A Params model', function() {


    afterEach(function() {
      MockConfig.restore();
    });

    describe('constructor', function() {

      it('should trigger change events when query parameters change', function() {
        var query = new Collection();
        var params = new Params({
          query: query
        }, { QueryType: Collection });
        var listeners = jasmine.createSpyObj('listeners', [
          'change',
          'changeAttr'
        ]);

        // Listen to params change events
        params.on('change', listeners.change);
        params.on('change:query', listeners.changeAttr);

        // Add event query model
        query.add({ id: 'foo' });
        expect(listeners.change.callCount).toEqual(1);
        expect(listeners.changeAttr.callCount).toEqual(1);

        // Change query model
        query.get('foo').set('hello', 'world');
        expect(listeners.change.callCount).toEqual(2);
        expect(listeners.changeAttr.callCount).toEqual(2);

        // Remove query model
        query.remove('foo');
        expect(listeners.change.callCount).toEqual(3);
        expect(listeners.changeAttr.callCount).toEqual(3);


        // Reset query models
        query.reset([{ id: 'foo' }, { id: 'bar' }]);
        expect(listeners.change.callCount).toEqual(4);
        expect(listeners.changeAttr.callCount).toEqual(4);
      });

      it('should trigger change events when the query attribute is overwritten', function() {
        var queryA = new Collection();
        var queryB = new Collection();
        var queryC = new Collection();
        var params = new Params({
          query: queryA
        }, { QueryType: Collection });

        var listeners = jasmine.createSpyObj('listeners', [
          'change',
          'changeAttr'
        ]);

        params.set('query', queryB);

        params.on('change', listeners.change);
        params.on('change:query', listeners.changeAttr);

        // Old query model change -->
        // params shouldn't trigger change
        queryA.add({ id: 'foo' });
        expect(listeners.change).not.toHaveBeenCalled();
        expect(listeners.changeAttr).not.toHaveBeenCalled();

        // New query model changes -->
        // params should trigger chnage
        queryB.add({ id: 'bar' });
        expect(listeners.change.callCount).toEqual(1);
        expect(listeners.changeAttr.callCount).toEqual(1);

        // Set a new query object
        params.set('query', queryC);
        expect(listeners.change.callCount).toEqual(2);
        expect(listeners.changeAttr.callCount).toEqual(2);

        queryC.add({ id: 'yo' });
        expect(listeners.change.callCount).toEqual(3);
        expect(listeners.changeAttr.callCount).toEqual(3);
      });

      it('should not require a query parameter', function() {
        // Should throw error
        new Params();
      });

      it('should convert a query array to a ChainedQueries object', function() {
        var MockQuery = jasmine.createSpy('MockQuery');
        var params = new Params({
          query: ['foo', 'bar']
        }, { QueryType: MockQuery });

        expect(MockQuery).toHaveBeenCalledWith(['foo', 'bar']);
        expect(params.get('query')).toBeInstanceOf(MockQuery);
      });

      it('should accept a Query object as a query', function() {
        var MockQuery = jasmine.createSpy('MockQuery');
        var query = new MockQuery();
        var params = new Params({
          query: query
        }, { QueryType: MockQuery });

        expect(params.get('query')).toEqual(query);
      });

    });


    describe('data binding', function() {

      it('should bind to aeris/config api keys', function() {
        var params = new Params();
        MockConfig.stubApiKeys();

        expect(params.get('client_id')).toEqual(MockConfig.API_ID_STUB);
        expect(params.get('client_secret')).toEqual(MockConfig.API_SECRET_STUB);
      });

      it('should prefer set api key attributes', function() {
        var params = new Params();
        var CLIENT_SECRET_ATTR = 'CLIENT_SECRET_ATTR_PARAMS';
        var CLIENT_ID_ATTR = 'CLIENT_ID_ATTR_PARAMS';

        params.set({
          client_id: CLIENT_ID_ATTR,
          client_secret: CLIENT_SECRET_ATTR
        });
        MockConfig.stubApiKeys();

        expect(params.get('client_id')).toEqual(CLIENT_ID_ATTR);
        expect(params.get('client_secret')).toEqual(CLIENT_SECRET_ATTR);
      });

    });


    describe('validation', function() {

      describe('p', function() {
        var params;

        beforeEach(function() {
          params = new Params(null, { validate: false });
        });


        function shouldFailBoundsValidation(bounds) {
          expect(function() {
            params.set({
              p: bounds
            }, { validate: true });
          }).toThrowType('ValidationError');
        }

        function shouldPassBoundsValidation(bounds) {
          params.set({
            p: bounds
          }, { validate: true });
        }


        it('should require bounds to contain two latLon arrays', function() {
          shouldFailBoundsValidation(['foo', 'bar']);
        });

        it('should require that bounds area is more than 0', function() {
          shouldFailBoundsValidation([[0, 0], [0, 0]]);
          shouldFailBoundsValidation([[45, -90], [45, -80]]);
        });

        it('should accept bounds which define an area', function() {
          shouldPassBoundsValidation([
            [45, -90],
            [50, -85]
          ]);
        });

        it('should accept null bounds', function() {
          shouldPassBoundsValidation(null);
        });

        it('should accept a place name', function() {
          shouldPassBoundsValidation('Minneapolis, MN');
        });

        it('should accept :auto', function() {
          shouldPassBoundsValidation(':auto');
        });

        it('should accept a zip code', function() {
          shouldPassBoundsValidation(55417);
        });
      });

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

      it('should require \'query\' to be a ChainedQueries', function() {
        expect(function() {
          var params = new Params();

          params.set('query', 'foo', { validate: true });

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

        expect(json.someTime).toBeNear(dates.someTime.getTime() / 1000, 1.0);
        expect(json.from).toBeNear(dates.from.getTime() / 1000, 1.0);
        expect(json.to).toBeNear(dates.to.getTime() / 1000, 1.0);
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
        var query = { some: 'query' };
        var QueryType = Model;
        var params = new Params({
          query: query
        }, {
          QueryType: QueryType
        });

        spyOn(QueryType.prototype, 'toString').andReturn('foo:bar;foo:shabaaz');

        expect(params.toJSON().query).toEqual('foo:bar;foo:shabaaz');
      });

      it('should not require a query param', function() {
        var params = new Params({
          query: undefined
        });

        // Should not throw error
        params.toJSON();
      });

      it('should not return undefined, null, or empty arrays', function() {
        var params = new Params({
          emptyArray: [],
          nullValue: null,
          und: undefined,

          // Should keep these
          foo: 'bar',
          falseValue: false,
          negativeNumber: -5,
          emptyString: ''
        });
        var json = params.toJSON();

        expect(json.emptyArray).not.toBeDefined();
        expect(json.nullValue).not.toBeDefined();
        expect(json.und).not.toBeDefined();

        expect(json.foo).toEqual('bar');
        expect(json.falseValue).toEqual(false);
        expect(json.negativeNumber).toEqual(-5);
        expect(json.emptyString).toEqual('');
      });

    });


    describe('setBounds', function() {
      var params;

      beforeEach(function() {
        params = new Params(null, { validate: false });

        // Stub validation
        spyOn(params, 'validate');
      });


      it('should unset bounds, if null is passed', function() {
        params.setBounds([[12, 34], [56, 78]]);
        params.setBounds(null);

        expect(params.has('bounds')).toEqual(false);
      });

    });


    describe('*Filter methods', function() {
      var params, mockFilter;
      var FILTERS_STUB, OPTIONS_STUB;

      var MockFilter = new MockFactory({
        methods: [
          'add',
          'remove',
          'reset'
        ],
        inherits: Collection
      });

      beforeEach(function() {
        mockFilter = new MockFilter();
        params = new Params({
          filter: mockFilter
        }, { validate: false });
        FILTERS_STUB = ['FILTERS_STUB_A', 'FILTERS_STUB_B'];
        OPTIONS_STUB = { STUB: 'OPTIONS_STUB' };
      });


      it('should proxy Filter methods', function() {
        _.each([
          'add',
          'remove',
          'reset'
        ], function(filterMethodName) {
          params[filterMethodName + 'Filter'](FILTERS_STUB, OPTIONS_STUB);
          expect(mockFilter[filterMethodName]).toHaveBeenCalledWith(FILTERS_STUB, OPTIONS_STUB);
        });
      });

    });


    describe('*Query methods', function() {
      var params, mockQuery;
      var QUERY_STUB, OPTIONS_STUB;

      var MockQuery = new MockFactory({
        methods: [
          'add',
          'remove',
          'reset'
        ],
        inherits: Collection
      });

      beforeEach(function() {
        QUERY_STUB = ['QUERY_STUB_A', 'QUERY_STUB_B'];
        OPTIONS_STUB = { STUB: 'OPTIONS_STUB' };

        mockQuery = new MockQuery();
        params = new Params({
          query: mockQuery
        }, {
          validate: false,
          QueryType: MockQuery
        });
      });


      it('should proxy Query methods', function() {
        _.each([
          'add',
          'remove',
          'reset'
        ], function(queryMethodName) {
          params[queryMethodName + 'Query'](QUERY_STUB, OPTIONS_STUB);
          expect(mockQuery[queryMethodName]).toHaveBeenCalledWith(QUERY_STUB, OPTIONS_STUB);
        });
      });

    });

  });

});
