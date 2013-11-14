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

  });

});
