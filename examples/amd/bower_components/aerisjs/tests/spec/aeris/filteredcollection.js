define([
  'aeris/util',
  'aeris/filteredcollection',
  'aeris/collection',
  'aeris/model'
], function(_, FilteredCollection, Collection, Model) {
  var Types = {
    TYPE_A: 'TYPE_A',
    TYPE_B: 'TYPE_B',
    TYPE_C: 'TYPE_C'
  };


  var TypeModelFactory = function(type) {
    var model = new Model({ type: type });

    model.jasmineToString = function() {
      return 'MODEL_' + type;
    };

    return model;
  };

  var TypeModel_A = _.partial(TypeModelFactory, Types.TYPE_A);
  var TypeModel_B = _.partial(TypeModelFactory, Types.TYPE_B);
  var TypeModel_C = _.partial(TypeModelFactory, Types.TYPE_C);

  var isTypeFilter = function(type, model) {
    return model.get('type') === type;
  };

  var isType_A = _.partial(isTypeFilter, Types.TYPE_A);
  var isType_B = _.partial(isTypeFilter, Types.TYPE_B);
  var isType_C = _.partial(isTypeFilter, Types.TYPE_C);



  describe('A FilteredCollection', function() {
    var sourceCollection, filteredCollection;
    var modelA, modelB, modelC;

    beforeEach(function() {
      sourceCollection = new Collection();
      filteredCollection = new FilteredCollection(null, {
        source: sourceCollection
      });

      modelA = new TypeModel_A;
      modelB = new TypeModel_B;
      modelC = new TypeModel_C;
    });


    describe('constructor', function() {

      it('should require a valid source collection', function() {
        expect(function() {
          new FilteredCollection();
        }).toThrowType('InvalidArgumentError');

        expect(function() {
          new FilteredCollection(null, {
            sourceCollection: 'foo'
          });
        }).toThrowType('InvalidArgumentError');
      });

      it('should add source collection\'s models (without filter)', function() {
        var SOURCE_MODELS = [
          modelA, modelB, modelC
        ];
        sourceCollection.add(SOURCE_MODELS);

        filteredCollection = new FilteredCollection(null, {
          source: sourceCollection
        });

        expect(filteredCollection.models).toEqual(SOURCE_MODELS);
      });

      it('should add source collection\'s models (with filter)', function() {
        sourceCollection.add([modelA, modelB, modelC]);

        filteredCollection = new FilteredCollection(null, {
          source: sourceCollection,
          filter: isType_A
        });

        expect(filteredCollection.models).toEqual([modelA]);
      });

      it('should set a default filter, which always returns true', function() {
        var filter;
        spyOn(FilteredCollection.prototype, 'setFilter').andCallThrough();

        new FilteredCollection(null, {
          source: sourceCollection
        });

        filter = FilteredCollection.prototype.setFilter.mostRecentCall.args[0];

        expect(filter()).toEqual(true);
      });

    });

    describe('Data binding', function() {

      it('should add models added to source collection', function() {
        sourceCollection.add([modelA, modelB]);

        expect(filteredCollection.models).toEqual([modelA, modelB]);
      });

      it('should reset models reset on source collection', function() {
        sourceCollection.reset([modelA, modelB]);
        expect(filteredCollection.models).toEqual([modelA, modelB]);

        sourceCollection.reset([modelA, modelC]);
        expect(filteredCollection.models).toEqual([modelA, modelC]);

        sourceCollection.reset();
        expect(filteredCollection.models).toEqual([]);
      });

      it('should remove models removed from source collection', function() {
        sourceCollection.reset([modelA, modelB, modelC]);

        sourceCollection.remove(modelB);
        expect(filteredCollection.models).toEqual([modelA, modelC]);
      });

      // Note that if the filteredCollection contains references
      // to the same models as in the sourceCollection,
      // changes to models (and related events) will all fire
      // on both the source and filtered collections the same.
      it('should contain references to source models (not copies)', function() {
        var ID_STUB = 'ID_STUB';
        sourceCollection.add(new Model({
          id: ID_STUB
        }));

        expect(filteredCollection.get(ID_STUB) === sourceCollection.get(ID_STUB)).toEqual(true);
      });

    });


    describe('setFilter', function() {

      it('should update models from the source collection, using the filter', function() {
        sourceCollection.add([modelA, modelB, modelC]);

        filteredCollection.setFilter(isType_A);
        expect(filteredCollection.models).toEqual([modelA]);

        filteredCollection.setFilter(function(model) {
          return isType_B(model) || isType_C(model);
        });
        expect(filteredCollection.models).toEqual([modelB, modelC]);
      });

      it('should not compound filters', function() {
        sourceCollection.add([modelA, modelB, modelC]);

        filteredCollection.setFilter(isType_A);

        // Setting a second filter shuold start us fresh
        // from sourceCollection models
        // (ie should not be isType_A && isType_B)
        filteredCollection.setFilter(isType_B);

        expect(filteredCollection.models).toEqual([modelB]);
      });

      it('should use the set filter when adding new models from the source collection', function() {
        var modelA_2 = new TypeModel_A();
        filteredCollection.setFilter(isType_A);

        sourceCollection.add([modelA, modelB]);
        expect(filteredCollection.models).toEqual([modelA]);

        sourceCollection.reset([modelA, modelC]);
        expect(filteredCollection.models).toEqual([modelA]);

        sourceCollection.add(modelA_2);
        expect(filteredCollection.models).toEqual([modelA, modelA_2]);
      });

      it('should set the context of the filter', function() {
        var ctx = { STUB: 'CTX' };
        var filter = jasmine.createSpy('filter').andCallFake(function() {
          expect(this).toEqual(ctx);
          return true;
        });

        filteredCollection.setFilter(filter, ctx);
        sourceCollection.add([modelA, modelB]);

        expect(filter).toHaveBeenCalled();
      });

    });

  });

});
