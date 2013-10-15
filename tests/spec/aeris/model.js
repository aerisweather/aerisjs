define([
  'aeris/util',
  'aeris/model'
], function(_, Model, ValidationError) {
  function TestFactory(opt_options) {
    var options = _.extend({
      attrs: undefined,
      options: undefined,
      isValid: true
    }, opt_options);

    spyOn(Model.prototype, 'isValid').andCallFake(function() {
      if (!options.isValid) {
        this.trigger('invalid', this, 'some error');
      }
      return options.isValid;
    });

    this.model = new Model(options.attrs, options.options);
  }

  describe('A Model', function() {
    describe('constructor', function() {
      it('should not validate on instantiation, by default', function() {
        var test = new TestFactory();
        expect(Model.prototype.isValid).not.toHaveBeenCalled();
      });
      it('should optionally validate on instantiation', function() {
        var test = new TestFactory({
          options: {
            validate: true
          }
        });

        expect(Model.prototype.isValid).toHaveBeenCalledInTheContextOf(test.model);
      });
    });

    describe('isValid', function() {
      it('should throw validation errors, if invalid', function() {
        var test = new TestFactory({
          isValid: false
        });

        expect(function() {
          test.model.isValid();
        }).toThrowType('ValidationError');
      });

      it('should not throw validation errors, if valid', function() {
        var test = new TestFactory({
          isValid: true
        });

        // Should not throw error
        test.model.isValid();
      });
    });
  });
});
