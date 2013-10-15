define([
  'aeris/util',
  'api/params/model/filter'
], function(_, Filter) {

  describe('An AerisApiFilter', function() {

    describe('constructor', function() {

      it('should run validation', function() {
        spyOn(Filter.prototype, 'isValid');

        new Filter();
        expect(Filter.prototype.isValid).toHaveBeenCalled();
      });

    });

    describe('validation', function() {

      it('should require a valid name', function() {
        var options = {
          validFilters: ['foo', 'bar']
        };

        expect(function() {
          new Filter({ name: 'wazaam' }, options);
        }).toThrowType('ValidationError');

        // Shouldn't throw error
        new Filter({ name: 'foo' }, options);
        new Filter({ name: 'bar' }, options);
      });

      it('should not require a valid name, if no validFilters options is set', function() {
        new Filter({ name: 'wazaam' });
      });

    });

  });

});
