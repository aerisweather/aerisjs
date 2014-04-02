define([
  'aeris/util',
  'aeris/limitedcollection',
  'aeris/collection',
  'aeris/model'
], function(_, LimitedCollection, Collection, Model) {

  var PopulatedCollection = function(opt_modelCount, opt_ModelType) {
    this.modelCount_ = opt_modelCount || 5;
    this.ModelType_ = opt_ModelType || Model;
    this.models_ = this.createModels_();

    return new Collection(this.models_);
  };

  PopulatedCollection.prototype.createModels_ = function() {
    var models = [];

    _.times(this.modelCount_, function() {
      models.push(new this.ModelType_);
    }, this);

    return models;
  };


  describe('A LimitedCollection', function() {
    var SOURCE_COUNT = 30, LIMIT = 10;
    var sourceCollection, limitedCollection;

    beforeEach(function() {
      sourceCollection = new PopulatedCollection(SOURCE_COUNT);
      limitedCollection = new LimitedCollection(null, {
        sourceCollection: sourceCollection,
        limit: LIMIT
      });

      limitedCollection.isMaintainingLimit = function() {
        if (sourceCollection.length >= LIMIT) {
          return this.length === LIMIT;
        }
        else {
          return this.length === sourceCollection.length;
        }
      };

      limitedCollection.isLimitedVersionOfSource = function() {
        var hasSameModelsAsSource = this.reduce(function(runningValue, model) {
          var sourceModel = sourceCollection.at(this.indexOf(model));
          var isSameModel = (model === sourceModel);

          return !isSameModel ? false : runningValue;
        }, true, this);

        return this.isMaintainingLimit() && hasSameModelsAsSource;
      };
    });

    function shouldBeLimitedVersionOfSource() {
      expect(limitedCollection.isLimitedVersionOfSource()).toEqual(true);
    }


    describe('constructor', function() {

      it('should add the first LIMIT number of models from the source collection', shouldBeLimitedVersionOfSource);

    });

    describe('Bindings to source collection', function() {

      describe('when a source collection adds a model', function() {

        describe('outside of the limit', function() {

          beforeEach(function() {
            sourceCollection.add(new Model(), { at: LIMIT + 1 });
          });


          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

        describe('inside of the limit', function() {

          beforeEach(function() {
            sourceCollection.addInsideLimit = function() {
              this.add(new Model(), { at: LIMIT - 2 });
            };
          });


          it('should add the model to the limited collection', function() {
            sourceCollection.addInsideLimit();
            shouldBeLimitedVersionOfSource();
          });

        });

      });

      describe('when a source collection adds multiple models', function() {
        var COUNT = 5;
        var addedModels = new PopulatedCollection(COUNT).models;

        describe('within the limit', function() {

          beforeEach(function() {
            sourceCollection.add(addedModels, { at: LIMIT - COUNT - 1 });
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

        describe('outside of the limit', function() {

          beforeEach(function() {
            sourceCollection.add(addedModels, { at: LIMIT + 1 });
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

        describe('straddling the limit', function() {

          beforeEach(function() {
            sourceCollection.add(addedModels, { at: LIMIT - COUNT + 2 });
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

      });


      describe('when a source collection removes a model', function() {

        beforeEach(function() {
          sourceCollection.removeAt = function(index) {
            var modelAtIndex = this.at(index);
            sourceCollection.remove(modelAtIndex);
          };
        });


        describe('within the limit', function() {

          beforeEach(function() {
            sourceCollection.removeAt(LIMIT - 2);
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

        describe('outside of the limit', function() {

          beforeEach(function() {
            sourceCollection.removeAt(LIMIT + 1);
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

      });


      describe('when a source collection removes multiple models', function() {
        var COUNT = 5;

        beforeEach(function() {
          sourceCollection.removeCountAt = function(count, index) {
            var modelsToRemove = [];

            _.times(count, function(n) {
              modelsToRemove.push(this.at(index + n));
            }, this);

            this.remove(modelsToRemove);
          };
        });


        describe('within the limit', function() {

          beforeEach(function() {
            sourceCollection.removeCountAt(COUNT, LIMIT - COUNT - 1);
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });


        describe('outside the limit', function() {

          beforeEach(function() {
            sourceCollection.removeCountAt(COUNT, sourceCollection.length - COUNT);
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });


        describe('straddling the limit', function() {

          beforeEach(function() {
            sourceCollection.removeCountAt(COUNT, limitedCollection.length - 3);
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

      });

      describe('when the source collection is reset', function() {

        beforeEach(function() {
          sourceCollection.resetWithCount = function(count) {
            this.reset(new PopulatedCollection(count).models);
          };
        });


        describe('with more models than the limit', function() {

          beforeEach(function() {
            sourceCollection.resetWithCount(LIMIT + 10);
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

        describe('with less models than the limit', function() {

          beforeEach(function() {
            sourceCollection.resetWithCount(LIMIT - 2);
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

        describe('with no models', function() {

          beforeEach(function() {
            sourceCollection.reset();
          });

          it('should be a limited version of the source collection', shouldBeLimitedVersionOfSource);

        });

      });

    });

  });

});
