define([
  'aeris/util',
  'application/form/model/toggle',
  'application/form/collection/radiocollection'
], function(_, Toggle, RadioCollection) {

  var MockModel = function(opt_attrs, opt_options) {
    Toggle.call(this, opt_attrs, opt_options);

    spyOn(this, 'select').andCallThrough();
    spyOn(this, 'deselect').andCallThrough();
    spyOn(this, 'toggle').andCallThrough();
  };
  _.inherits(MockModel, Toggle);

  function getModels(opt_count, opt_attrs, opt_options) {
    var models = [];
    var count = opt_count || 3;

    _.times(count, function() {
      models.push(new MockModel(opt_attrs, opt_options));
    });

    return models;
  }

  describe('A RadioCollection', function() {

    describe('constructor', function() {

      it('should select the first model, if none are selected', function() {
        var models = getModels(3, { selected: false });
        var collection = new RadioCollection(models);

        expect(models[0].select).toHaveBeenCalled();
      });

      it('should not change the selected model, if one is selected.', function() {
        var models = getModels(3);
        var collection;

        models[1].set('selected', true);

        collection = new RadioCollection(models);

        expect(models[1].get('selected')).toEqual(true);
      });

      it('should select only the first selected model, if several are selected', function() {
        var models = getModels(3);
        models[1].select();
        models[2].select();

        new RadioCollection(models);

        expect(models[1].get('selected')).toEqual(true);
        expect(models[2].get('selected')).toEqual(false);
      });

      describe('Event bindings', function() {

        it('should call selectUnique when a model is selected', function() {
          var models = getModels(3);
          var collection;

          spyOn(RadioCollection.prototype, 'selectUnique');

          collection = new RadioCollection(models);

          models[1].trigger('select', models[1]);
          expect(collection.selectUnique).toHaveBeenCalledWith(models[1]);

          expect(collection.selectUnique).not.toHaveBeenCalledWith(models[0]);
          expect(collection.selectUnique).not.toHaveBeenCalledWith(models[2]);
        });

        it('should not allow all models to be deselected', function() {
          var models = getModels(3);
          var collection;

          models[0].set('selected', true);
          models[1].set('selected', false);
          models[2].set('selected', false);

          collection = new RadioCollection(models);

          // Collection should bounce back
          // and re-select the model
          models[0].set('selected', false);
          expect(models[0].select).toHaveBeenCalled();

          models[1].select();
          models[1].deselect();
          expect(models[1].select).toHaveBeenCalled();
        });

        it('should select the first model, if the selected model is removed', function() {
          var models = getModels(3);
          var collection;

          models[0].set('selected', true);
          models[1].set('selected', false);
          models[2].set('selected', false);

          collection = new RadioCollection(models);

          collection.remove(models[0]);

          expect(collection.at(0).select).toHaveBeenCalled();
        });

      });

    });

    describe('selectUnique', function() {

      it('should select the model', function() {
        var models = getModels(3);
        var collection = new RadioCollection(models);

        collection.selectUnique(models[1]);
        expect(models[1].select).toHaveBeenCalled();
      });

      it('should deselect all other models', function() {
        var models = getModels(3);
        var collection = new RadioCollection(models);

        collection.selectUnique(models[1]);

        expect(models[0].deselect).toHaveBeenCalled();
        expect(models[2].deselect).toHaveBeenCalled();
      });

    });


    describe('add', function() {

      it('should deselect other models if the new model is selected', function() {
        var models = getModels(3);
        var newModel = new MockModel({ selected: true });
        var collection = new RadioCollection(models);

        models[1].select();

        collection.add(newModel);
        expect(models[1].get('selected')).toEqual(false);
        expect(newModel.get('selected')).toEqual(true);
      });

    });


    describe('getSelected', function() {

      it('should return the selected model', function() {
        var collection;
        var models = getModels(3);

        models[1].set('selected', true);
        collection = new RadioCollection(models);

        expect(collection.getSelected()).toEqual(models[1]);

        models[2].set('selected', true);
        expect(collection.getSelected()).toEqual(models[2]);
      });

    });

  });

});
