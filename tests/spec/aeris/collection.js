define([
  'aeris/util',
  'sinon',
  'aeris/collection',
  'aeris/model'
], function(_, sinon, Collection, Model) {


  var MockModel = function() {
    var model = new Model();

    spyOn(model, 'isValid').andReturn(true);

    return model;
  };


  var ValidModel = function() {
    var model = new MockModel();

    model.isValid.andReturn(true);

    return model;
  };


  var InvalidModel = function() {
    var model = new MockModel();

    model.isValid.andReturn(false);

    return model;
  };



  describe('A Collection', function() {
    var MockModel_orig = MockModel;

      beforeEach(function() {
      MockModel = jasmine.createSpy('MockModel#ctor').andCallFake(MockModel_orig);
    });



    describe('constructor', function() {

      beforeEach(function() {
        spyOn(Collection.prototype, 'isValid');
      });

      it('should reject invalid models as first argument', function() {
        expect(function() {
          new Collection({
            not: {
              an: {
                array: 'of models'
              }
            }
          });
        }).toThrowType('InvalidArgumentError');

        new Collection([new Model(), new Model()]);
        new Collection([]);
        new Collection();
        new Collection(null);
      });

      it('should optionally validate', function() {
        new Collection(null, {
          validate: true
        });

        expect(Collection.prototype.isValid).toHaveBeenCalled();
      });

      it('should not validate, by default', function() {
        new Collection();

        expect(Collection.prototype.isValid).not.toHaveBeenCalled();
      });
    });


    describe('add', function() {
      it('should create a model, passing in modelOptions as options', function() {
        var collection = new Collection(undefined, {
          model: MockModel,
          modelOptions: {
            foo: 'bar'
          }
        });

        MockModel.andCallFake(function(attrs, opts) {
          expect(attrs).toEqual({ some: 'attr' });
          expect(opts.foo).toEqual('bar');

          return new Model();
        });

        collection.add({ some: 'attr' });
        expect(MockModel).toHaveBeenCalled();
      });
    });


    describe('isValid', function() {

      it('should run validation on all models', function() {
        var models = [
          new MockModel(),
          new MockModel(),
          new MockModel()
        ];
        var collection = new Collection(models);

        collection.isValid();

        _.each(models, function(model) {
          expect(model.isValid).toHaveBeenCalled();
        });
      });

      it('should return true if collection has no models', function() {
        var collection = new Collection();

        expect(collection.isValid()).toEqual(true);
      });

      it('should return true if all models validate', function() {
        var models = [
          new ValidModel(),
          new ValidModel(),
          new ValidModel()
        ];
        var collection = new Collection(models);

        expect(collection.isValid()).toEqual(true);
      });

      it('should return false if any model fails validation', function() {
        var models = [
          new ValidModel(),
          new InvalidModel(),
          new ValidModel()
        ];
        var collection = new Collection(models);

        expect(collection.isValid()).toEqual(false);
      });

    });

  });
});
