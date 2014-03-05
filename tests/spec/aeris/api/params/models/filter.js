define([
  'aeris/util',
  'aeris/api/params/models/filter',
  'aeris/collection'
], function(_, Filter, Collection) {

  describe('An AerisApiFilter', function() {

    describe('constructor', function() {

      it('should use the \'name\' attribute as it\'s id', function() {
        var NAME_STUB = 'NAME_STUB';
        var filter = new Filter({
          name: NAME_STUB
        });

        expect(filter.id).toEqual(NAME_STUB);
      });

    });

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

  });

});
