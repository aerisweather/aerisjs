define([
  'aeris/util',
  'application/form/model/combotoggle',
  'sinon',
  'application/form/model/toggle',
  'aeris/collection',
  'aeris/model'
], function(_, ComboToggle, sinon, Toggle, Collection, Model) {

  var MockToggle = function(opt_attrs) {
    Model.call(this, opt_attrs, {
      idAttribute: 'name'
    });

    this.select = jasmine.createSpy('MockToggle#select');
    this.deselect = jasmine.createSpy('MockToggle#deselect');
    this.toggle = jasmine.createSpy('MockToggle#toggle');
  };
  _.inherits(MockToggle, Toggle);

  function getToggleSet (opt_count, opt_attrs) {
    var toggles = [];
    var count = opt_count || 3;

    _.times(count, function() {
      toggles.push(new MockToggle(opt_attrs));
    });

    return toggles
  }

  describe('A ComboToggle', function() {

    describe('validate', function() {

      it('should reject invalid childToggles', function() {
        var combo = new ComboToggle(undefined, {
          childTogglesAttribute: 'myToggles'
        });

        _.each([
          ['foo', 'bar'],
          [1, 2, 3],
          [new Date()],
          new MockToggle(),
          new Model(),
          [new Model()],
          [new MockToggle(), new Model()]
        ], function(invalidToggles) {
          expect(function() {
            combo.set('myToggles', invalidToggles, { validate: true });
          }).toThrowType('ValidationError');
        });
      });

    });

    describe('Event bindings', function() {

      it('should select all toggles on select', function() {
        var combo;
        spyOn(ComboToggle.prototype, 'selectAll');

        combo = new ComboToggle();

        combo.trigger('select');

        expect(ComboToggle.prototype.selectAll).toHaveBeenCalled();
      });

      it('should deselect all child toggles on deselect', function() {
        var combo;
        spyOn(ComboToggle.prototype, 'deselectAll');

        combo = new ComboToggle();

        combo.trigger('deselect');

        expect(ComboToggle.prototype.deselectAll).toHaveBeenCalled();
      });

    });

    describe('selectAll', function() {

      it('should select all toggles', function() {
        var toggles = getToggleSet();
        var combo = new ComboToggle({
          childToggles: toggles
        });

        combo.selectAll();

        _.each(toggles, function(t) {
          expect(t.select).toHaveBeenCalled();
        });
      });

    });

    describe('deselectAll', function() {

      it('should deselect all toggles', function() {
        var toggles = getToggleSet();
        var combo = new ComboToggle({
          childToggles: toggles
        });

        combo.deselectAll();

        _.each(toggles, function(t) {
          expect(t.deselect).toHaveBeenCalled();
        });
      });

    });

    describe('toggleAll', function() {

      it('should toggle all toggles', function() {
        var toggles = getToggleSet();
        var combo = new ComboToggle({
          childToggles: toggles
        });

        combo.toggleAll();

        _.each(toggles, function(t) {
          expect(t.toggle).toHaveBeenCalled();
        });
      });

    });


    describe('addToggles', function() {

      it('should add an array of Toggle models', function() {
        var togglesA = getToggleSet(3);
        var togglesB = getToggleSet(3);
        var combo = new ComboToggle();

        combo.addToggles(togglesA);
        expect(combo.get('childToggles')).toEqual(togglesA);

        combo.addToggles(togglesB);
        expect(combo.get('childToggles')).toEqual(togglesA.concat(togglesB));
      });

      it('should add the toggles to the specified childTogglesAttribute', function() {
        var toggles = getToggleSet();
        var combo = new ComboToggle(undefined, {
          childTogglesAttribute: 'myToggles'
        });

        combo.addToggles(toggles);
        expect(combo.get('myToggles')).toEqual(toggles);
      });

      it('should add all Toggle models in a ToggleCollection', function() {
        var toggleCollectionA = new Collection(getToggleSet(3));
        var toggleCollectionB = new Collection(getToggleSet(3));
        var combo = new ComboToggle();

        combo.addToggles(toggleCollectionA);
        expect(combo.get('childToggles')).toEqual(toggleCollectionA.models);

        combo.addToggles(toggleCollectionB);
        expect(combo.get('childToggles')).toEqual(toggleCollectionA.models.concat(toggleCollectionB.models));
      });

      it('should not add duplicate child Toggle models', function() {
        var toggles = getToggleSet(3);
        var combo = new ComboToggle();

        combo.addToggles(toggles);
        combo.addToggles([toggles[1]]);

        expect(combo.get('childToggles')).toEqual(toggles);
      });

    });

  });

});
