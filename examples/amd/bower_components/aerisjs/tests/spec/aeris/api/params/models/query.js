define([
  'aeris/util',
  'aeris/api/params/models/query',
  'aeris/errors/validationerror',
  'aeris/api/operator'
], function(_, Query, ValidationError, Operator) {

  describe('A Query', function() {

    beforeEach(function() {
      // Stub out validation
      spyOn(Query.prototype, 'validate');
    });

    describe('constructor', function() {

      it('should validate immediatedly', function() {
        new Query();
        expect(Query.prototype.validate).toHaveBeenCalled();
      });

      it('should use the \'property\' attribute as an id', function() {
        var query = new Query({
          property: 'foo'
        });

        expect(query.id).toEqual('foo');
      });

      it('should use Operator.AND as the default operator', function() {
        var query = new Query({
          property: 'foo',
          value: 'bar'
        });

        expect(query.get('operator')).toEqual(Operator.AND);
      });

    });


    describe('validate', function() {

      beforeEach(function() {
        // Prevent ctor from forcing validation
        spyOn(Query.prototype, 'isValid');

        // Call through validation spy
        Query.prototype.validate.andCallThrough();
      });

      it('should require \'property\' to be defined', function() {
        var query = new Query({
          value: 'foo',
          operator: Operator.AND
        });

        expect(query.validate(query.attributes)).toBeInstanceOf(ValidationError);
      });


      it('should require \'property\' to be a string', function() {
        var query = new Query({
          property: new Date(),
          value: 'foo',
          operator: Operator.AND
        });

        expect(query.validate(query.attributes)).toBeInstanceOf(ValidationError);
      });

      it('should require \'value\' to be defined', function() {
        var query = new Query({
          property: 'foo',
          operator: Operator.AND
        });

        expect(query.validate(query.attributes)).toBeInstanceOf(ValidationError);
      });

      it('should require a valid \'operator\'', function() {
        var query = new Query({
          property: 'foo',
          value: 'bar',
          operator: 'AndAlsoMaybe'
        });

        expect(query.validate(query.attributes)).toBeInstanceOf(ValidationError);
      });

      it('should accept a valid query', function() {
        var query = new Query({
          property: 'foo',
          value: 'bar',
          operator: Operator.AND
        });

        expect(query.validate(query.attributes)).not.toBeInstanceOf(ValidationError);
      });

    });


    describe('toString', function() {
      var query;

      beforeEach(function() {
        query = new Query({
          property: 'foo',
          value: 'bar',
          operator: Operator.OR
        });
      });

      it('should validate the model', function() {
        spyOn(query, 'isValid');

        query.toString();

        expect(query.isValid).toHaveBeenCalled();
      });

      it('should return a colon-separated property-value pair', function() {
        expect(query.toString()).toEqual('foo:bar');
      });

    });

  });

});
