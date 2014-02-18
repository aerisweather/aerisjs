define([
  'aeris/util',
  'aeris/model',
  'aeris/collection',
  'aeris/api/params/collections/filtercollection',
  'aeris/api/operator'
], function(_, Model, BaseCollection, BaseFilterCollection, Operator) {

  // Create a test version of a FilterCollection,
  // which uses a generic model.
  var FilterCollection = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Model
    });

    BaseFilterCollection.call(this, opt_attrs, options);
  };
  _.inherits(FilterCollection, BaseFilterCollection);


  describe('An AerisApiFilterCollection', function() {

    describe('toString', function() {

      it('should be empty if collection is empty', function() {
        var filters = new FilterCollection();
        expect(filters.toString()).toEqual('');
      });

      it('should be a single filter name, if collection has a single filter', function() {
        var filters = new FilterCollection();
        var filter = new Model({
          name: 'foo',
          operator: Operator.AND
        });
        filters.add(filter);

        expect(filters.toString()).toEqual('foo');

        // isOr value shouldn't matter
        filter.set('isOr', true);
        expect(filters.toString()).toEqual('foo');
      });

      it('should be a operator-separated list of filter names', function() {
        var filters = new FilterCollection([
          {
            name: 'foo'
          },
          {
            name: 'bar',
            operator: Operator.AND
          },
          {
            name: 'wazaam',
            operator: Operator.OR
          }
        ]);

        expect(filters.toString()).toEqual('foo,bar;wazaam');
      });

    });

    describe('add', function() {

      it('should create a filter from a name string', function() {
        var filters = new FilterCollection();

        filters.add('sieve');
        expect(filters.length).toEqual(1);
        expect(filters.at(0)).toBeInstanceOf(Model);
        expect(filters.at(0).get('name')).toEqual('sieve');

      });

      it('should accept an array of filter names', function() {
        var filters = new FilterCollection();
        var filterNames = ['sieve', 'colander', 'coffee filter'];
        filters.add(filterNames);

        expect(filters.length).toEqual(3);
        expect(filters.at(0).get('name')).toEqual('sieve');
        expect(filters.at(1).get('name')).toEqual('colander');
        expect(filters.at(2).get('name')).toEqual('coffee filter');
      });

      it('should create models with an optional operator', function() {
        var filters = new FilterCollection();
        var filterNames = ['sieve', 'colander', 'coffee filter'];
        filters.add(filterNames, { operator: Operator.OR });

        filters.each(function(ff) {
          expect(ff.get('operator')).toEqual(Operator.OR);
        });
        expect(filters.length).toEqual(3);
      });

      it('should allow for standard aeris.Collection#add syntax', function() {
        var filters = new FilterCollection();
        filters.add([
          { name: 'sieve', operator: Operator.AND },
          { name: 'colander', operator: Operator.OR }
        ]);

        expect(filters.at(0)).toBeInstanceOf(Model);
        expect(filters.at(0).get('name')).toEqual('sieve');
        expect(filters.at(0).get('operator')).toEqual(Operator.AND);
        expect(filters.at(1).get('name')).toEqual('colander');
        expect(filters.at(1).get('operator')).toEqual(Operator.OR);
      });

    });

    describe('reset', function() {

      it('should create a filter from a name string', function() {
        var filters = new FilterCollection();

        filters.add(new Model({
          name: 'wire mesh',
          operator: Operator.AND
        }));

        filters.reset('sieve');
        expect(filters.length).toEqual(1);
        expect(filters.at(0)).toBeInstanceOf(Model);
        expect(filters.at(0).get('name')).toEqual('sieve');

      });

      it('should accept an array of filter names', function() {
        var filters = new FilterCollection();
        var filterNames = ['sieve', 'colander', 'coffee filter'];

        filters.add(new Model({
          name: 'wire mesh',
          operator: Operator.AND
        }));

        filters.reset(filterNames);

        expect(filters.length).toEqual(3);
        expect(filters.at(0).get('name')).toEqual('sieve');
        expect(filters.at(1).get('name')).toEqual('colander');
        expect(filters.at(2).get('name')).toEqual('coffee filter');
      });

      it('should create models with an optional operator', function() {
        var filters = new FilterCollection();
        var filterNames = ['sieve', 'colander', 'coffee filter'];

        filters.add(new Model({
          name: 'wire mesh',
          operator: Operator.AND
        }));

        filters.reset(filterNames, { operator: Operator.OR });

        expect(filters.length).toEqual(3);
        filters.each(function(ff) {
          expect(ff.get('operator')).toEqual(Operator.OR);
        });
      });

      it('should allow for standard aeris.Collection#reset syntax', function() {
        var filters = new FilterCollection();

        filters.add(new Model({
          name: 'wire mesh',
          operator: Operator.AND
        }));

        filters.reset([
          { name: 'sieve', operator: Operator.AND },
          { name: 'colander', operator: Operator.OR }
        ]);

        expect(filters.length).toEqual(2);
        expect(filters.at(0)).toBeInstanceOf(Model);
        expect(filters.at(0).get('name')).toEqual('sieve');
        expect(filters.at(0).get('operator')).toEqual(Operator.AND);
        expect(filters.at(1).get('name')).toEqual('colander');
        expect(filters.at(1).get('operator')).toEqual(Operator.OR);
      });

      it('should remove all filters, if called with no arguments', function() {
        var filters = new FilterCollection([
          { name: 'sieve', operator: Operator.AND },
          { name: 'colander', operator: Operator.OR }
        ]);

        filters.reset();

        expect(filters.length).toEqual(0);
      });

      it('should remove all filter, if called with an empty array', function() {
        var filters = new FilterCollection([
          { name: 'sieve', operator: Operator.AND },
          { name: 'colander', operator: Operator.OR }
        ]);

        filters.reset([]);

        expect(filters.length).toEqual(0);
      });

    });

    describe('remove', function() {

      it('should remove a single filter by name', function() {
        var fatedFilter = new Model({ name: 'sieve', operator: Operator.AND });
        var luckyFilter = new Model({ name: 'colander', operator: Operator.OR });
        var filters = new FilterCollection([luckyFilter, fatedFilter]);

        filters.remove('sieve');

        expect(filters.length).toEqual(1);
        expect(filters.at(0).toJSON()).toEqual(luckyFilter.toJSON());
      });

      it('should remove multiple filters by name', function() {
        var fatedFilterA = new Model({ name: 'sieve', operator: Operator.AND });
        var fatedFilterB = new Model({ name: 'wire mesh', operator: Operator.OR });
        var luckyFilter = new Model({ name: 'colander', operator: Operator.OR });
        var filters = new FilterCollection([fatedFilterA, luckyFilter, fatedFilterB]);

        filters.remove(['sieve', 'wire mesh']);
        expect(filters.length).toEqual(1);
        expect(filters.at(0).toJSON()).toEqual(luckyFilter.toJSON());
      });

      it('should remove a multiple filters with the same name', function() {
        var fatedFilterA = new Model({ name: 'sieve', operator: Operator.AND });
        var fatedFilterB = new Model({ name: 'sieve', operator: Operator.OR });
        var luckyFilter = new Model({ name: 'colander', operator: Operator.OR });
        var filters = new FilterCollection([fatedFilterA, luckyFilter, fatedFilterB]);

        filters.remove('sieve');
        expect(filters.length).toEqual(1);
        expect(filters.at(0).toJSON()).toEqual(luckyFilter.toJSON());
      });

      it('should allow for standard aeris.Collection#remove syntax', function() {
        var fatedFilterA = new Model({ name: 'sieve', operator: Operator.AND });
        var fatedFilterB = new Model({ name: 'sieve', operator: Operator.OR });
        var luckyFilter = new Model({ name: 'colander', operator: Operator.OR });
        var filters = new FilterCollection([fatedFilterA, luckyFilter, fatedFilterB]);

        spyOn(BaseCollection.prototype, 'remove');
        filters.remove([fatedFilterA, fatedFilterB]);

        expect(BaseCollection.prototype.remove).toHaveBeenCalledWith([fatedFilterA, fatedFilterB]);
        expect(BaseCollection.prototype.remove).toHaveBeenCalledInTheContextOf(filters);
      });

    });

  });

});
