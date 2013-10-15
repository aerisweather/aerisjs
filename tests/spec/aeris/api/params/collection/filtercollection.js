define([
  'aeris/util',
  'aeris/model',
  'aeris/collection',
  'api/params/collection/filtercollection',
  'api/params/model/filter'
], function(_, Model, BaseCollection, FilterCollection, Filter) {

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
          operator: 'AND'
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
            operator: 'AND'
          },
          {
            name: 'wazaam',
            operator: 'OR'
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
        expect(filters.at(0)).toBeInstanceOf(Filter);
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
        filters.add(filterNames, { operator: 'OR' });

        filters.each(function(ff) {
          expect(ff.get('operator')).toEqual('OR');
        });
        expect(filters.length).toEqual(3);
      });

      it('should allow for standard aeris.Collection#add syntax', function() {
        var filters = new FilterCollection();
        filters.add([
          { name: 'sieve', operator: 'AND' },
          { name: 'colander', operator: 'OR' }
        ]);

        expect(filters.at(0)).toBeInstanceOf(Filter);
        expect(filters.at(0).get('name')).toEqual('sieve');
        expect(filters.at(0).get('operator')).toEqual('AND');
        expect(filters.at(1).get('name')).toEqual('colander');
        expect(filters.at(1).get('operator')).toEqual('OR');
      });

    });

    describe('reset', function() {

      it('should create a filter from a name string', function() {
        var filters = new FilterCollection();

        filters.add(new Filter({
          name: 'wire mesh',
          operator: 'AND'
        }));

        filters.reset('sieve');
        expect(filters.length).toEqual(1);
        expect(filters.at(0)).toBeInstanceOf(Filter);
        expect(filters.at(0).get('name')).toEqual('sieve');

      });

      it('should accept an array of filter names', function() {
        var filters = new FilterCollection();
        var filterNames = ['sieve', 'colander', 'coffee filter'];

        filters.add(new Filter({
          name: 'wire mesh',
          operator: 'AND'
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

        filters.add(new Filter({
          name: 'wire mesh',
          operator: 'AND'
        }));

        filters.reset(filterNames, { operator: 'OR' });

        expect(filters.length).toEqual(3);
        filters.each(function(ff) {
          expect(ff.get('operator')).toEqual('OR');
        });
      });

      it('should allow for standard aeris.Collection#reset syntax', function() {
        var filters = new FilterCollection();

        filters.add(new Filter({
          name: 'wire mesh',
          operator: 'AND'
        }));

        filters.reset([
          { name: 'sieve', operator: 'AND' },
          { name: 'colander', operator: 'OR' }
        ]);

        expect(filters.length).toEqual(2);
        expect(filters.at(0)).toBeInstanceOf(Filter);
        expect(filters.at(0).get('name')).toEqual('sieve');
        expect(filters.at(0).get('operator')).toEqual('AND');
        expect(filters.at(1).get('name')).toEqual('colander');
        expect(filters.at(1).get('operator')).toEqual('OR');
      });

    });

    describe('remove', function() {

      it('should remove a single filter by name', function() {
        var fatedFilter = new Filter({ name: 'sieve', operator: 'AND' });
        var luckyFilter = new Filter({ name: 'colander', operator: 'OR' });
        var filters = new FilterCollection([luckyFilter, fatedFilter]);

        filters.remove('sieve');

        expect(filters.length).toEqual(1);
        expect(filters.at(0).toJSON()).toEqual(luckyFilter.toJSON());
      });

      it('should remove multiple filters by name', function() {
        var fatedFilterA = new Filter({ name: 'sieve', operator: 'AND' });
        var fatedFilterB = new Filter({ name: 'wire mesh', operator: 'OR' });
        var luckyFilter = new Filter({ name: 'colander', operator: 'OR' });
        var filters = new FilterCollection([fatedFilterA, luckyFilter, fatedFilterB]);

        filters.remove(['sieve', 'wire mesh']);
        expect(filters.length).toEqual(1);
        expect(filters.at(0).toJSON()).toEqual(luckyFilter.toJSON());
      });

      it('should remove a multiple filters with the same name', function() {
        var fatedFilterA = new Filter({ name: 'sieve', operator: 'AND' });
        var fatedFilterB = new Filter({ name: 'sieve', operator: 'OR' });
        var luckyFilter = new Filter({ name: 'colander', operator: 'OR' });
        var filters = new FilterCollection([fatedFilterA, luckyFilter, fatedFilterB]);

        filters.remove('sieve');
        expect(filters.length).toEqual(1);
        expect(filters.at(0).toJSON()).toEqual(luckyFilter.toJSON());
      });

      it('should allow for standard aeris.Collection#remove syntax', function() {
        var fatedFilterA = new Filter({ name: 'sieve', operator: 'AND' });
        var fatedFilterB = new Filter({ name: 'sieve', operator: 'OR' });
        var luckyFilter = new Filter({ name: 'colander', operator: 'OR' });
        var filters = new FilterCollection([fatedFilterA, luckyFilter, fatedFilterB]);

        spyOn(BaseCollection.prototype, 'remove');
        filters.remove([fatedFilterA, fatedFilterB]);

        expect(BaseCollection.prototype.remove).toHaveBeenCalledWith([fatedFilterA, fatedFilterB]);
        expect(BaseCollection.prototype.remove).toHaveBeenCalledInTheContextOf(filters);
      });

    });

  });

});
