define([
  'aeris/util',
  'aeris/viewmodel',
  'aeris/model'
], function(_, ViewModel, Model) {

  describe('A ViewModel', function() {

    describe('constructor', function() {

      describe('transforms', function() {

        it('should apply transforms when data attributes change', function() {
          var dataModel = new Model();
          var viewModel = new ViewModel(undefined, {
            data: dataModel,
            attributeTransforms: {
              km: function() {
                if (!this.getDataAttribute('miles')) {
                  return this.get('km');
                }
                return this.getDataAttribute('miles') * 1.609344;
              },
              shouted: function() {
                if (!this.getDataAttribute('spoken')) {
                  return this.get('shouted');
                }
                return this.getDataAttribute('spoken').toUpperCase();
              }
            }
          });

          dataModel.set('miles', 1000);
          expect(viewModel.get('km')).toEqual(1609.344);

          dataModel.set('spoken', 'hello there');
          expect(viewModel.get('shouted')).toEqual('HELLO THERE');
        });

        it('should not touch attributes without corresponding transforms', function() {
          var dataModel = new Model();
          var viewModel = new ViewModel({
            nauticalMiles: 50
          }, {
            data: dataModel,
            attributeTransforms: {
              km: function() {
                if (!this.getDataAttribute('miles')) {
                  return this.get('km');
                }
                return this.getDataAttribute('miles') * 1.609344;
              },
              shouted: function() {
                if (!this.getDataAttribute('spoken')) {
                  return this.get('shouted');
                }
                return this.getDataAttribute('spoken').toUpperCase();
              }
            }
          });

          dataModel.set('leagues', 10000);
          expect(viewModel.get('nauticalMiles')).toEqual(50);
        });

        it('should do nothing if not attributeTransforms are defined', function() {
          var dataModel = new Model();
          var viewModel = new ViewModel({
            nauticalMiles: 50
          }, {
            data: dataModel
          });

          dataModel.set('leagues', 10000);
          expect(viewModel.get('nauticalMiles')).toEqual(50);
        });

      });

    });

    describe('destroy', function() {

      it('should no longer bind dataModel attributes to viewModel attributes', function() {
        var KM_PER_MILE = 1.60934;
        var dataModel = new Model({
          miles: 50
        });
        var viewModel = new ViewModel(null, {
          data: dataModel,
          attributeTransforms: {
            km: function() {
              return this.getDataAttribute('miles') * KM_PER_MILE;
            }
          }
        });

        viewModel.destroy();

        dataModel.set('miles', 100);
        expect(viewModel.get('km')).not.toEqual(100 * KM_PER_MILE);
        expect(viewModel.get('km')).toEqual(50 * KM_PER_MILE);
      });

    });


    describe('syncToModel', function() {

      it('should manually update the view model, using attribute transforms', function() {
        var KM_PER_MILE = 1.60934;
        var dataModel = new Model({ miles: 50 });
        var viewModel = new ViewModel(null, {
          data: dataModel,
          attributeTransforms: {
            km: function() {
              return this.getDataAttribute('miles') * KM_PER_MILE;
            }
          }
        });

        viewModel.set('km', 100);
        expect(viewModel.get('km', 100));

        viewModel.syncToModel();
        expect(viewModel.get('km')).toEqual(50 * KM_PER_MILE);
      });

    });

    describe('getDataAttribute', function() {
      var dataModel, viewModel;

      beforeEach(function() {
        dataModel = new Model();
        viewModel = new ViewModel(null, {
          data: dataModel
        });
      });


      it('should return shallow nested data attributes', function() {
        dataModel.set('foo', 'bar');

        expect(viewModel.getDataAttribute('foo')).toEqual('bar');
      });

      it('should return deep nested data attribtues', function() {
        dataModel.set({
          deep: {
            nested: {
              attribute: 'value'
            }
          }
        });

        expect(viewModel.getDataAttribute('deep.nested.attribute')).toEqual('value');
      });

      it('should return undefined if deep nested attributes are not defined', function() {
        expect(viewModel.getDataAttribute('not.a.defined.attribute')).toBeUndefined();
      });

      it('should throw an error if passed undefined', function() {
        expect(function() {
          viewModel.getDataAttribute(undefined);
        }).toThrowType('InvalidArgumentError');
      });

      it('should return undefined is passed an empty string', function() {
        expect(viewModel.getDataAttribute('')).toBeUndefined();
      });

    });

  });

});
