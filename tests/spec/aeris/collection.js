define([
  'aeris/util',
  'sinon',
  'aeris/collection',
  'aeris/model'
], function(_, sinon, Collection, Model) {
  function TestFactory(opt_options) {
    var options = _.extend({
      models: undefined,
      options: undefined,
      isValid: true
    }, opt_options);

    this.collection = new Collection(options.models, options.options);
  }

  function MockModel(opt_options) {
    var options = _.extend({
      isValid: true
    }, opt_options);

    spyOn(this, 'isValid').andReturn(options.isValid);
  }
  _.inherits(MockModel, Model);
  MockModel.prototype = sinon.createStubInstance(Model);


  describe('A Collection', function() {

    describe('constructor', function() {

      beforeEach(function() {
        spyOn(Collection.prototype, 'isValid');
      });

      it('should optionally validate', function() {
        new TestFactory({
          options: {
            validate: true
          }
        });
        expect(Collection.prototype.isValid).toHaveBeenCalled();
      });

      it('should not validate, by default', function() {
        new TestFactory();
        expect(Collection.prototype.isValid).not.toHaveBeenCalled();
      });
    });

    describe('isValid', function() {

      it('should run validation on all models', function() {
        var models = [
          new MockModel(),
          new MockModel(),
          new MockModel()
        ];
        var test = new TestFactory({
          models: models
        });

        test.collection.isValid();

        _.each(models, function(model) {
          expect(model.isValid).toHaveBeenCalled();
        });
      });

      it('should return true if collection has no models', function() {
        var test = new TestFactory({
          models: []
        });

        expect(test.collection.isValid()).toEqual(true);
      });

      it('should return true if all models validate', function() {
        var modelOptions = { isValid: true };
        var models = [
          new MockModel(modelOptions),
          new MockModel(modelOptions),
          new MockModel(modelOptions)
        ];
        var test = new TestFactory({
          models: models
        });

        expect(test.collection.isValid()).toEqual(true);
      });

      it('should return false if any model fails validation', function() {
        var models = [
          new MockModel({ isValid: true }),
          new MockModel({ isValid: false }),
          new MockModel({ isValid: true })
        ];
        var test = new TestFactory({
          models: models
        });

        expect(test.collection.isValid()).toEqual(false);
      });

    });

  });
});
