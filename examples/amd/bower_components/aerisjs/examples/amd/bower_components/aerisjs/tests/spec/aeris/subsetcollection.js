define([
  'aeris/util',
  'aeris/subsetcollection',
  'aeris/model',
  'aeris/collection',
  'aeris/promise'
], function(_, SubsetCollection, Model, Collection, Promise) {
  var Types = {
    TYPE_A: 'TYPE_A',
    TYPE_B: 'TYPE_B',
    TYPE_C: 'TYPE_C'
  };

  var ModelsCount = function(opt_modelCount, opt_ModelType) {
    this.modelCount_ = opt_modelCount || 5;
    this.ModelType_ = opt_ModelType || Model;
    this.models_ = this.createModels_();

    return this.models_;
  };

  ModelsCount.prototype.createModels_ = function() {
    var models = [];

    _.times(this.modelCount_, function(i) {
      var model = new this.ModelType_;

      model.jasmineToString = function() {
        return 'MODEL_COUNT_' + i;
      };

      models.push(model);
    }, this);

    return models;
  };


  /**
   * Creates models with a 'type' attribute.
   *
   * @param {string} type
   * @return {Model}
   * @constructor
   */
  var ModelTypeFactory = function(type) {
    var model = new Model({ type: type });

    model.jasmineToString = function() {
      return 'MODEL_' + type;
    };

    return model;
  };

  var ModelTypeA = _.partial(ModelTypeFactory, Types.TYPE_A);
  var ModelTypeB = _.partial(ModelTypeFactory, Types.TYPE_B);
  var ModelTypeC = _.partial(ModelTypeFactory, Types.TYPE_C);

  var isType = function(type, model) {
    return model.get('type') === type;
  };

  var isTypeA = _.partial(isType, Types.TYPE_A);
  var isTypeB = _.partial(isType, Types.TYPE_B);
  var isTypeC = _.partial(isType, Types.TYPE_C);


  function isMaintainingLimit(subsetCollection, limit) {
    var sourceCollection = subsetCollection.getSourceCollection();

    if (sourceCollection.length >= limit) {
      return subsetCollection.length === limit;
    }
    // Source is under limit,
    // so our subset should be the same length as the source
    else {
      return subsetCollection.length === sourceCollection.length;
    }
  }


  describe('A SubsetCollection', function() {
    var subsetCollection, sourceCollection;
    var modelTypeA, modelTypeB, modelTypeC, modelTypesABC;

    beforeEach(function() {
      sourceCollection = new Collection();
      subsetCollection = new SubsetCollection(sourceCollection);
    });

    beforeEach(function() {
      modelTypeA = new ModelTypeA();
      modelTypeB = new ModelTypeB();
      modelTypeC = new ModelTypeC();

      modelTypesABC = [modelTypeA, modelTypeB, modelTypeC];
    });


    beforeEach(function() {
      this.addMatchers({
        toOnlyContainSourceModels: function() {
          var subsetCollection = this.actual;
          var sourceCollection = subsetCollection.getSourceCollection();

          var differentModels = _.difference(subsetCollection.models, sourceCollection.models);


          this.message = !this.isNot ?
            function() {
              return 'Expected subset to contain only models in the source, ' +
                'but it also contained: ' + jasmine.pp(differentModels);
            } :
            function() {
              return 'Expected subset not to contain only models in the source';
            };

          return differentModels.length === 0;
        },
        toMatchTheSourceOrder: function() {
          var subsetCollection = this.actual;
          var sourceCollection = subsetCollection.getSourceCollection();

          var isCorrectOrder = subsetCollection.reduce(function(isCorrect, subsetModel) {
            var nextSubsetModel, prevSubsetModel, subsetModelIndex;
            var isNextInCorrectPosition = true, isPrevInCorrectPosition = true;

            if (!sourceCollection.contains(subsetModel)) {
              return isCorrect;
            }

            subsetModelIndex = subsetCollection.indexOf(subsetModel);
            nextSubsetModel = subsetCollection.at(subsetModelIndex + 1);
            prevSubsetModel = subsetCollection.at(subsetModelIndex - 1);

            if (sourceCollection.contains(nextSubsetModel)) {
              isNextInCorrectPosition = sourceCollection.indexOf(nextSubsetModel) > sourceCollection.indexOf(subsetModel);
            }
            if (sourceCollection.contains(prevSubsetModel)) {
              isPrevInCorrectPosition = sourceCollection.indexOf(prevSubsetModel) < sourceCollection.indexOf(subsetModel);
            }


            return isNextInCorrectPosition && isPrevInCorrectPosition ? isCorrect : false;
          }, true);

          this.message = !this.isNot ?
            function() {
              return 'Expected subset models to be in the same order as the source models';
            } :
            function() {
              return 'Expected subset models not ot be in the same order as the source models';
            };

          return isCorrectOrder;
        },
        toEnforceFilterAndLimit: function(filter, limit) {
          var subsetCollection = this.actual;
          var sourceCollection = subsetCollection.getSourceCollection();
          var filteredSourceModels, filteredAndLimitedSourceModels;

          !_.isNull(limit) || (limit = sourceCollection.length);
          filter || (filter = _.constant(true));

          filteredSourceModels = sourceCollection.filter(filter);
          filteredAndLimitedSourceModels = filteredSourceModels.slice(0, limit);

          this.message = !this.isNot ?
            function() {
              return 'Expected subset collection to enforce a filter and limit, ' +
                'with models ' + jasmine.pp(filteredAndLimitedSourceModels) + ', ' +
                'but actual subset models are ' + jasmine.pp(subsetCollection.models);
            } :
            function() {
              return 'Expected subset collection not to enforce filter and limit. Subset colleciton ' +
                'models: ' + jasmine.pp(subsetCollection.models);
            };

          return _.isEqual(subsetCollection.models, filteredAndLimitedSourceModels);
        }
      });
    });


    describe('constructor', function() {

      it('should reject invalid source collections', function() {

        expect(function() {
          new SubsetCollection();
        }).toThrowType('InvalidArgumentError');

        expect(function() {
          new SubsetCollection('foo');
        }).toThrowType('InvalidArgumentError');

      });

      it('should accept a collection as a source', function() {
        new SubsetCollection(sourceCollection);
      });

      it('should should accept an array of models as a source', function() {
        new SubsetCollection([new Model(), new Model()]);
      });


      it('should add source collection\'s models (without filter or limit)', function() {
        sourceCollection.add(modelTypesABC);

        subsetCollection = new SubsetCollection(sourceCollection);

        expect(subsetCollection.models).toEqual(modelTypesABC);
      });

    });


    describe('Data binding to source collection', function() {

      function itShouldStayInSync() {

        it('should stay in sync when models are added to the source collection', function() {
          sourceCollection.add(modelTypesABC);
        });

        it('should stay in sync when models are removed from the source collection', function() {
          sourceCollection.add(modelTypesABC);

          sourceCollection.remove(modelTypeB);
        });

        it('should stay in sync when models are reset from the source collection (no new models)', function() {
          sourceCollection.add(modelTypesABC);

          sourceCollection.reset();
        });

        it('should stay in sync when models are reset from the source collection (with new models)', function() {
          sourceCollection.add(modelTypesABC);

          sourceCollection.reset([new Model(), new Model(), new Model()]);
        });

        it('should stay in sync when models are changed in the source collection', function() {
          sourceCollection.add(modelTypesABC);

          sourceCollection.at(1).set('type', 'changed type');
        });
      }

      function itShouldStayInSyncWithLimit(limit) {

        it('more models than the limit are added', function() {
          sourceCollection.add(new ModelsCount(limit + 5));
        });

        it('fewer models than the limit are added', function() {
          sourceCollection.add(new ModelsCount(limit - 2));
        });

        it('models are added at an index above the limit', function() {
          sourceCollection.add(new ModelsCount(limit - 5));
          sourceCollection.add(new ModelsCount(10));
        });

        it('models are added at an index straddling the limit', function() {
          sourceCollection.add(new ModelsCount(limit + 5));
          sourceCollection.add(new ModelsCount(5), { at: 8 });
        });

        it('models are added to the source at an index inside the limit', function() {
          sourceCollection.add(new ModelsCount(limit + 5));
          sourceCollection.add(new ModelsCount(3), { at: 1 });
        });

        it('models are removed from the source at an index inside the limit', function() {
          var models = new ModelsCount(limit + 5);
          sourceCollection.add(models);
          sourceCollection.remove(models[1], models[2], models[4]);
        });

        it('models are removed from the source at an index outside the limit', function() {
          var models = new ModelsCount(limit + 5);
          sourceCollection.add(models);

          sourceCollection.remove(models[limit + 2], models[limit + 3]);
        });

        it('models are removed from the source at an index straddling the limit', function() {
          var models = new ModelsCount(limit + 5);
          sourceCollection.add(models);

          sourceCollection.remove(models[limit - 2], models[limit], models[limit + 2]);
        });

        it('source models are reset, with more models than the limit', function() {
          sourceCollection.add(new ModelsCount(limit + 5));

          sourceCollection.reset(new ModelsCount(limit + 5));
        });

        it('source models are reset, with fewer models than the limit', function() {
          sourceCollection.add(new ModelsCount(limit + 5));

          sourceCollection.reset(new ModelsCount(limit - 2));
        });

        it('source models are reset, with no models added', function() {
          sourceCollection.add(new ModelsCount(limit + 5));

          sourceCollection.reset();
        });

      }

      afterEach(function() {
        expect(subsetCollection).toOnlyContainSourceModels();
        expect(subsetCollection).toMatchTheSourceOrder();
      });


      describe('without a filter or limit', function() {

        itShouldStayInSync();


        afterEach(function() {
          expect(subsetCollection.length).toEqual(sourceCollection.length);
        });

      });


      describe('when a filter is set (no limit)', function() {

        beforeEach(function() {
          subsetCollection.setFilter(isTypeB);
        });


        itShouldStayInSync();


        afterEach(function() {
          expect(subsetCollection).toEnforceFilterAndLimit(isTypeB, null);
        });

      });


      describe('when a limit is set (no filter)', function() {
        var LIMIT = 10;

        beforeEach(function() {
          subsetCollection.setLimit(LIMIT);
        });


        itShouldStayInSync();
        itShouldStayInSyncWithLimit(LIMIT);


        afterEach(function() {
          expect(subsetCollection).toEnforceFilterAndLimit(null, LIMIT);
        });

      });


      describe('when a filter and a limit are set', function() {
        var LIMIT = 10;

        beforeEach(function() {
          subsetCollection.setLimit(LIMIT);
          subsetCollection.setFilter(isTypeB);
        });


        itShouldStayInSync();
        itShouldStayInSyncWithLimit(LIMIT);


        describe('when a source model is changed', function() {

          describe('so that it passes the filter', function() {

            describe('and the model is within the limit', function() {

              it('should be added to the subset', function() {
                var models = new ModelsCount(LIMIT + 5);
                var changingModel = models[LIMIT - 2];

                changingModel.set('type', Types.TYPE_A);                          // model fails filter
                sourceCollection.add(models);
                expect(subsetCollection.contains(changingModel)).toEqual(false);  // baseline test

                changingModel.set('type', Types.TYPE_B);                          // model passes filter
                expect(subsetCollection.contains(changingModel)).toEqual(true);
              });

            });

            describe('and the model is outside the limit', function() {

              it('should not be added to the subset', function() {
                var models = new ModelsCount(LIMIT + 5, ModelTypeB);
                var changingModel = models[LIMIT + 2];

                changingModel.set('type', Types.TYPE_A);                          // model fails filter
                sourceCollection.add(models);
                expect(subsetCollection.contains(changingModel)).toEqual(false);  // baseline test

                changingModel.set('type', Types.TYPE_B);                          // model passes filter
                expect(subsetCollection.contains(changingModel)).toEqual(false);
              });

            });

          });

          describe('so that it fails the filter', function() {

            describe('and the model is within the limit', function() {

              it('should be removed from the subset', function() {
                var models = new ModelsCount(LIMIT + 5);
                var changingModel = models[LIMIT - 2];

                changingModel.set('type', Types.TYPE_B);                          // model passes filter
                sourceCollection.add(models);
                expect(subsetCollection.contains(changingModel)).toEqual(true);  // baseline test

                changingModel.set('type', Types.TYPE_C);                          // model fails filter
                expect(subsetCollection.contains(changingModel)).toEqual(false);
              });

            });

            describe('and the model is outside the limit', function() {

              it('should not be added to the subset', function() {
                var models = new ModelsCount(LIMIT + 5, ModelTypeB);
                var changingModel = models[LIMIT + 2];

                sourceCollection.add(models);
                expect(subsetCollection.contains(changingModel)).toEqual(false);  // baseline test

                changingModel.set('type', Types.TYPE_C);                          // model fails filter
                expect(subsetCollection.contains(changingModel)).toEqual(false);
              });

            });

          });

        });


        afterEach(function() {
          expect(subsetCollection.length <= LIMIT).toEqual(true);
          expect(subsetCollection).toEnforceFilterAndLimit(isTypeB, LIMIT);
        });

      });

      it('should not reference the source collection\'s models array', function() {
        sourceCollection.add(modelTypesABC);

        subsetCollection.models.splice(0, 2);

        expect(sourceCollection.models).toEqual(modelTypesABC);
      });

    });


    describe('Events', function() {

      describe('request', function() {
        var onRequest, PROMISE_STUB = 'PROMISE_STUB';

        beforeEach(function() {
          onRequest = jasmine.createSpy('onRequest');
          subsetCollection.on('request', onRequest);
        });


        it('should proxy the source collection\'s \'request\' event ', function() {
          sourceCollection.trigger('request', sourceCollection, PROMISE_STUB);

          expect(onRequest).toHaveBeenCalledWith(sourceCollection, PROMISE_STUB);
        });

      });

      describe('sync', function() {
        var onSync, RESP_STUB = 'RESP_STUB';

        beforeEach(function() {
          onSync = jasmine.createSpy('onSync');
          subsetCollection.on('sync', onSync);
        });

        it('should proxy the source collection\'s \'sync\' event ', function() {
          sourceCollection.trigger('sync', sourceCollection, RESP_STUB);

          expect(onSync).toHaveBeenCalledWith(sourceCollection, RESP_STUB);
        });

      });


      describe('error', function() {
        var onError, RESP_STUB = 'RESP_STUB';

        beforeEach(function() {
          onError = jasmine.createSpy('onError');
          subsetCollection.on('error', onError);
        });

        it('should proxy the source collection\'s \'error\' event ', function() {
          sourceCollection.trigger('error', sourceCollection, RESP_STUB);

          expect(onError).toHaveBeenCalledWith(sourceCollection, RESP_STUB);
        });

      });

    });


    describe('setLimit', function() {
      var LIMIT = 10;

      it('should remove any models beyond the limit', function() {
        sourceCollection.add(new ModelsCount(LIMIT + 5));

        subsetCollection.setLimit(LIMIT);
        expect(subsetCollection.length).toEqual(LIMIT);
      });

      it('should not remove models if the subset has fewer models than the limit', function() {
        sourceCollection.add(new ModelsCount(LIMIT - 2));

        subsetCollection.setLimit(LIMIT);
        expect(subsetCollection.length).toEqual(LIMIT - 2);
      });

      describe('when the source has more models than the current limit', function() {

        beforeEach(function() {
          subsetCollection.setLimit(LIMIT - 3);
        });


        it('should add models from source', function() {
          sourceCollection.add(new ModelsCount(LIMIT + 5));

          subsetCollection.setLimit(LIMIT);
          expect(subsetCollection.length).toEqual(LIMIT);
        });

      });

      it('should not add any models if the source has none available', function() {
        sourceCollection.reset();

        subsetCollection.setLimit(LIMIT);

        expect(subsetCollection.length).toEqual(0);
      });

      afterEach(function() {
        expect(subsetCollection).toEnforceFilterAndLimit(null, LIMIT);
        expect(subsetCollection).toOnlyContainSourceModels();
        expect(subsetCollection).toMatchTheSourceOrder();
      });


    });


    describe('removeLimit', function() {
      var LIMIT = 10;

      beforeEach(function() {
        subsetCollection.setLimit(10);
      });


      it('should add all previously over-limit models from the source', function() {
        sourceCollection.add(new ModelsCount(LIMIT + 5));

        subsetCollection.removeLimit();

        expect(subsetCollection.length).toEqual(LIMIT + 5);
      });

      it('should allow models added to the source to be added to the subset (data binding)', function() {
        subsetCollection.removeLimit();

        sourceCollection.add(new ModelsCount(LIMIT + 5));

        expect(subsetCollection.length).toEqual(LIMIT + 5);
      });

      afterEach(function() {
        expect(subsetCollection).toOnlyContainSourceModels();
        expect(subsetCollection).toMatchTheSourceOrder();
      });


    });


    describe('setFilter', function() {

      it('should update models from the source collection, using the filter', function() {
        sourceCollection.add(modelTypesABC);

        subsetCollection.setFilter(isTypeA);
        expect(subsetCollection.models).toEqual([modelTypeA]);

        subsetCollection.setFilter(function(model) {
          return isTypeB(model) || isTypeC(model);
        });
        expect(subsetCollection.models).toEqual([modelTypeB, modelTypeC]);
      });

      it('should not compound filters', function() {
        sourceCollection.add([modelTypeA, modelTypeB, modelTypeC]);

        subsetCollection.setFilter(isTypeA);

        // Setting a second filter should start us fresh
        // from sourceCollection models
        // (ie should not be isTypeA && isTypeB)
        subsetCollection.setFilter(isTypeB);

        expect(subsetCollection.models).toEqual([modelTypeB]);
      });

      it('should use the filter when adding new models from the source collection', function() {
        var modelA_2 = new ModelTypeA();
        subsetCollection.setFilter(isTypeA);

        sourceCollection.add([modelTypeA, modelTypeB]);
        expect(subsetCollection.models).toEqual([modelTypeA]);

        sourceCollection.reset([modelTypeA, modelTypeC]);
        expect(subsetCollection.models).toEqual([modelTypeA]);

        sourceCollection.add(modelA_2);
        expect(subsetCollection.models).toEqual([modelTypeA, modelA_2]);
      });

      it('should set the context of the filter', function() {
        var ctx = { STUB: 'CTX' };
        var filter = jasmine.createSpy('filter').andCallFake(function() {
          expect(this).toEqual(ctx);
          return true;
        });

        subsetCollection.setFilter(filter, ctx);
        sourceCollection.add([modelTypeA, modelTypeB]);

        expect(filter).toHaveBeenCalled();
      });





      afterEach(function() {
        expect(subsetCollection).toOnlyContainSourceModels();
        expect(subsetCollection).toMatchTheSourceOrder();
      });


    });


    describe('removeFilter', function() {

      beforeEach(function() {
        subsetCollection.setFilter(isTypeB);

        sourceCollection.add(modelTypesABC);
      });


      it('should add all models from the source collection', function() {
        subsetCollection.removeFilter();
        expect(subsetCollection.contains(modelTypeA)).toEqual(true);
        expect(subsetCollection.contains(modelTypeB)).toEqual(true);
        expect(subsetCollection.contains(modelTypeC)).toEqual(true);
      });

      it('should not use the previous filter when new models are added to the source', function() {
        var newModelTypeB = new ModelTypeB();

        subsetCollection.removeFilter();

        sourceCollection.add(newModelTypeB);

        expect(subsetCollection.contains(newModelTypeB)).toEqual(true);
      });


      afterEach(function() {
        expect(subsetCollection).toOnlyContainSourceModels();
        expect(subsetCollection).toMatchTheSourceOrder();
      });
    });


    describe('fetch', function() {

      beforeEach(function() {
        spyOn(sourceCollection, 'fetch');
      });


      it('should fetch data from the source collection', function() {
        subsetCollection.fetch();

        expect(sourceCollection.fetch).toHaveBeenCalled();
      });

      it('should pass options on to the source collection\'s fetch method', function() {
        var OPTIONS_STUB = { STUB: 'OPTIONS_STUB' };

        subsetCollection.fetch(OPTIONS_STUB);

        expect(sourceCollection.fetch).toHaveBeenCalledWith(OPTIONS_STUB);
      });

      it('should return the source collection\'s promise to fetch', function() {
        var PROMISE_STUB = { STUB: 'PROMISE_STUB' };
        sourceCollection.fetch.andReturn(PROMISE_STUB);

        expect(subsetCollection.fetch()).toEqual(PROMISE_STUB);
      });

    });

  });

});
