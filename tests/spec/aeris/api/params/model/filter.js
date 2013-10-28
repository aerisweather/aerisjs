define([
  'aeris/util',
  'api/params/model/filter',
  'aeris/collection'
], function(_, Filter, Collection) {

  describe('An AerisApiFilter', function() {

    describe('Event bindings', function() {
      it('should run validation when added to a collection', function() {
        var filter;
        var collection = new Collection();

        spyOn(Filter.prototype, 'validate');

        filter = new Filter();
        expect(Filter.prototype.validate).not.toHaveBeenCalled();

        collection.add(filter);
        expect(Filter.prototype.validate).toHaveBeenCalled();
      });
    });

    describe('validation', function() {

      describe('filter name', function() {
        var collection;

        beforeEach(function() {
          collection = new Collection();
          collection.getValidFilters = jasmine.createSpy('getValidFilters').
            andReturn(['foo', 'bar']);
        });

        afterEach(function() {
          collection.off();
        });

        it('should not run validate the name if no collection is defined', function() {
          // Just make sure this doesn't throw
          // some error, trying to access
          // the collection.
          new Filter({ name: 'wazaam' });
        });

        it('should require a valid filter name, as defined by it\'s collection', function() {
          expect(function() {
            collection.add(new Filter({ name: 'wazaam' }));
          }).toThrowType('ValidationError');

          // Shouldn't throw error
          /*collection.add(new Filter({ name: 'foo' }));
          collection.add(new Filter({ name: 'bar' }));*/
        });

        it('should not require a valid name, if no validFilters are defined', function() {
          collection.getValidFilters.andReturn(undefined);

          // Shouldn't throw an error
          collection.add(new Filter({ name: 'wazaam' }));
        });
      });

    });

  });

});
