define([
  'aeris/util',
  'api/params/model/params'
], function(_, ApiParams) {

  function TestFactory() {
    this.params = new ApiParams();
  }


  describe('An AerisQueryParams model', function() {
    
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
    
    describe('setFilter', function() {
      
      it('should add a single filter to the \'filters\' attribute', function() {
        var test = new TestFactory();

        test.params.setFilter('sieve')
        expect(test.params.get('filter')).toEqual(['sieve']);

        test.params.setFilter('colander');
        expect(test.params.get('filter')).toEqual(['sieve', 'colander']);
      });

      it('should add multiple filters to the \'filters\' attribute', function() {
        var test = new TestFactory();

        test.params.setFilter(['sieve', 'colander']);
        expect(test.params.get('filter')).toEqual(['sieve', 'colander']);

        test.params.setFilter(['coffee filter', 'HEPA filter']);
        expect(test.params.get('filter')).toEqual([
          'sieve',
          'colander',
          'coffee filter',
          'HEPA filter'
        ]);
      });

      it('should replace existing, using the \'reset\' option', function() {
        var test = new TestFactory();

        test.params.setFilter(['sieve', 'colander']);

        test.params.setFilter(['coffee filter', 'HEPA filter'], { reset: true });
        expect(test.params.get('filter')).toEqual([
          'coffee filter',
          'HEPA filter'
        ]);

        test.params.setFilter(['sieve', 'coffee filter'], { reset: true });
        expect(test.params.get('filter')).toEqual(['sieve', 'coffee filter']);
      });

      it('should not create duplicate filters', function() {
        var test = new TestFactory();

        test.params.setFilter(['sieve', 'colander']);

        test.params.setFilter(['coffee filter', 'HEPA filter', 'sieve']);

        expect(test.params.get('filter')).toEqual([
          'sieve',
          'colander',
          'coffee filter',
          'HEPA filter'
        ]);
      });

    });

    describe('unsetFilter', function() {
      var test;

      beforeEach(function() {
        test = new TestFactory();
        test.params.set('filter', [
          'sieve',
          'colander',
          'coffee filter'
        ]);
      });

      it('should remove a single filter', function() {
        test.params.unsetFilter('sieve');
        expect(test.params.get('filter')).toEqual([
          'colander',
          'coffee filter'
        ]);

        test.params.unsetFilter('colander');
        expect(test.params.get('filter')).toEqual(['coffee filter']);
      });

      it('should remove multiple filters', function() {
        test.params.unsetFilter(['sieve', 'coffee filter']);
        expect(test.params.get('filter')).toEqual(['colander']);
      });

      it('should do nothing if the filter doesn\'t exist' , function() {
        test.params.unsetFilter('microfiber');
        expect(test.params.get('filter')).toEqual([
          'sieve',
          'colander',
          'coffee filter'
        ]);

        test.params.unsetFilter(['microfiber', 'sieve']);
        expect(test.params.get('filter')).toEqual([
          'colander',
          'coffee filter'
        ]);
      });

    });
    
  });

});
