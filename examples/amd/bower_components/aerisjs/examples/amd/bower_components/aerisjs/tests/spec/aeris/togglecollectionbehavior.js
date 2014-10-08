define([
  'aeris/util',
  'aeris/togglecollectionbehavior',
  'aeris/collection',
  'mocks/aeris/toggle'
], function(_, ToggleCollectionBehavior, Collection, MockToggle) {

  var ConcreteToggleCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: MockToggle
    });

    Collection.call(this, opt_models, options);
    ToggleCollectionBehavior.call(this);
  };
  _.inherits(ConcreteToggleCollection, Collection);
  _.extend(ConcreteToggleCollection.prototype, ToggleCollectionBehavior.prototype);


  var MockSelectedToggle = function() {
    return new MockToggle({ selected: true });
  };
  var MockDeselectedToggle = function() {
    return new MockToggle({ selected: false });
  };



  describe('ToggleCollectionBehavior', function() {
    var toggleCollection, toggleModels;

    beforeEach(function() {
      toggleModels = [
        new MockSelectedToggle(),
        new MockDeselectedToggle(),
        new MockSelectedToggle(),
        new MockDeselectedToggle()
      ];
      toggleCollection = new ConcreteToggleCollection(toggleModels);
    });


    describe('selectAll', function() {

      it('should select all models', function() {
        toggleCollection.selectAll();

        toggleModels.forEach(function(model) {
          expect(model.select).toHaveBeenCalled();
        });
      });

    });

    describe('deselectAll', function() {

      it('should deselect all models', function() {
        toggleCollection.deselectAll();

        toggleModels.forEach(function(model) {
          expect(model.deselect).toHaveBeenCalled();
        });
      });

    });

    describe('toggleAll', function() {

      it('should toggle all models', function() {
        toggleCollection.toggleAll();

        toggleModels.forEach(function(model) {
          expect(model.toggle).toHaveBeenCalled();
        });
      });

    });

    describe('selectOnly', function() {


      it('should select the specified model (model is selected)', function() {
        toggleCollection.selectOnly(toggleModels[0]);

        expect(toggleModels[0].select).toHaveBeenCalled();
      });

      it('should select the specified model (model is deselected)', function() {
        toggleCollection.selectOnly(toggleModels[1]);

        expect(toggleModels[1].select).toHaveBeenCalled();
      });

      it('should deselect all other models', function() {
        toggleCollection.selectOnly(toggleModels[1]);

        expect(toggleModels[0].deselect).toHaveBeenCalled();
        expect(toggleModels[2].deselect).toHaveBeenCalled();
        expect(toggleModels[3].deselect).toHaveBeenCalled();
      });

      it('should not deselect the specified model, if it starts out selected', function() {
        toggleCollection.selectOnly(toggleModels[0]);

        expect(toggleModels[0].deselect).not.toHaveBeenCalled();
      });

    });

    describe('getSelected', function() {

      it('should return all selected models', function() {
        expect(toggleCollection.getSelected()).toEqual([
          toggleModels[0],
          toggleModels[2]
        ]);
      });

    });

    describe('getDeselected', function() {

      it('should return all deselected models', function() {
        expect(toggleCollection.getDeselected()).toEqual([
          toggleModels[1],
          toggleModels[3]
        ]);
      });

    });

  });

});
