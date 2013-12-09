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
        new TestFactory();
        expect(Model.prototype.isValid).not.toHaveBeenCalled();
      });
      it('should optionally validate on instantiation', function() {
        spyOn(Model.prototype, 'isValid');

        new Model(null, {
          validate: true
        })

        expect(Model.prototype.isValid).toHaveBeenCalled();
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


    describe('set', function() {

      it('should normalize attribute before setting', function() {
        var model = new Model();
        var rawAttrs = { foo: 'bar', yo: 'wazaam' };

        model.normalize_ = function(attrs) {
          _.each(attrs, function(value, key) {
            attrs[key] = value + '_normal';
          });

          return attrs;
        };

        model.set(rawAttrs);

        expect(model.get('foo')).toEqual('bar_normal');
        expect(model.get('yo')).toEqual('wazaam_normal');
      });

      // Spec adapted from Backbone.Model spec
      // https://github.com/jashkenas/backbone/blob/master/test/model.js ~line 202
      it('should act like normal', function() {
        var a = new Model({id: 'id', foo: 1, bar: 2, baz: 3});
        var changeCount = 0;

        a.on('change:foo', function() { changeCount += 1; });
        a.set({'foo': 2});

        expect(a.get('foo')).toEqual(2);
        expect(changeCount).toEqual(1);

        a.set({'foo': 2}); // set with value that is not new shouldn't fire change event
        expect(a.get('foo')).toEqual(2);  // Foo should NOT have changed, still 2
        expect(changeCount).toEqual(1);   // Change count should NOT have incremented.

        a.validate = function(attrs) {
          expect(attrs.foo).toEqual(void 0);  // validate:true passed while unsetting
        };

        a.unset('foo', {validate: true});
        expect(a.get('foo')).toEqual(void 0); // Foo should have changed

        delete a.validate;
        expect(changeCount).toEqual(2);       // 'Change count should have incremented for unset.

        a.unset('id');
        expect(a.id).toBeUndefined();         // Unsetting the id should remove the id property.
      });

    });
    
    
    describe('getAtPath', function() {

      it('should resolve a deep path', function() {
        var model = new Model({
          deepObj: {
            levelA: {
              levelB: {
                foo: 'bar'
              }
            }
          }
        });

        expect(model.getAtPath('deepObj.levelA.levelB.foo')).toEqual('bar');
        expect(model.getAtPath('deepObj.levelA.levelB')).toEqual({ foo: 'bar' });
      });

      it('should resolve a shallow path', function() {
        var model = new Model({
          foo: 'bar'
        });

        expect(model.getAtPath('foo')).toEqual('bar');
      });
      
      it('should return undefined if the path cannot be resolved', function() {
        var model = new Model({
          deepObj: {
            levelA: {
              levelB: {
                foo: 'bar'
              }
            }
          }
        });

        _.each([
          'foo.bar',
          'foo.bar.faz',
          'deepObj.foo',
          'deepObj.levelA.foo',
          'deepObj.levelXYZ',
          'deepObj.levelA.levelB.foo.levelC.levelD'
        ], function(path) {
          expect(model.getAtPath(path)).toBeUndefined();
        });
      });

      it('should return undefined if the reference does not exist', function() {
        var model = new Model({
          deepObj: {
            levelA: {
              levelB: {
                foo: 'bar'
              }
            }
          }
        });

        _.each([
          'foo',
          'deepObj.foo',
          'deepObj.levelA.foo',
          'deepObj.levelA.levelB.foo.bar'
        ], function(path) {
            expect(model.getAtPath(path)).toBeUndefined();
        });
      });

      it('should throw a TypeError if called with anything but a string', function() {
        var model = new Model();

        _.each([
          true, false, undefined, null, NaN,
          new Date(), ['foo'], { foo: 'bar' }, function() {},
          1, -1, 0, Infinity
        ], function(path) {
          expect(function() {
            model.getAtPath(path);
          }).toThrowType('TypeError');
        });
      });
      
    });


    describe('cloneUsingType', function() {

      var MockModel;

      beforeEach(function() {
        MockModel = jasmine.createSpy('MockModel#ctor');
        _.inherits(MockModel, Model);
      });

      it('should create an instance of the specified Type', function() {
        var model = new Model();
        expect(model.cloneUsingType(MockModel)).toBeInstanceOf(MockModel);
      });

      it('should reject non-constructors', function() {
        var model = new Model();

        expect(function() {
          model.cloneUsingType('foo');
        }).toThrowType('TypeError');

        model.cloneUsingType(MockModel);
      });

      it('should reject constructors for non-models', function() {
        var model = new Model();
        var NotAModel = function() {};

        expect(function() {
          model.cloneUsingType(NotAModel);
        }).toThrowType('InvalidArgumentError');

        model.cloneUsingType(MockModel);
      });

      describe('the cloned model', function() {

        it('should be constructed with the same attributes as the original', function() {
          var model = new Model({
            foo: 'bar',
            hello: { you: 'all' }
          });

          MockModel.andCallFake(function(attrs) {
            expect(attrs.foo).toEqual('bar');
            expect(attrs.hello).toEqual({ you: 'all' });
          });

          model.cloneUsingType(MockModel);
          expect(MockModel).toHaveBeenCalled();
        });

        it('should not contain a reference to the original\'s attributes object', function() {
          var model = new Model({
            foo: 'bar',
            hello: { you: 'all' }
          });

          MockModel.andCallFake(function(attrs) {
            attrs.foo = 'shazaam';

            // Changes to clone should not effect original
            expect(model.attributes.foo).toEqual('bar');
          });

          model.cloneUsingType(MockModel);
          expect(MockModel).toHaveBeenCalled();
        });

        it('should be created with the same options as the original', function() {
          var model = new Model(null, {
            isPassingSpec: 'I sure hope so.'
          });

          MockModel.andCallFake(function(attrs, options) {
            expect(options.isPassingSpec).toEqual('I sure hope so.');
          });

          model.cloneUsingType(MockModel);
          expect(MockModel).toHaveBeenCalled();
        });

      });

    });


    describe('clone', function() {

      it('should act as though it\'s not defined', function() {
        // Because Backbone's Model#clone is broken by
        // our inheritance pattern.
        var model = new Model();

        expect(function() {
          model.clone();
        }).toThrowType('TypeError');
      });

    });

  });
});
