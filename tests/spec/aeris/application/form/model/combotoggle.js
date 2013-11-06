define([
  'aeris/util',
  'application/form/model/combotoggle',
  'sinon',
  'application/form/model/toggle',
  'aeris/collection',
  'aeris/model'
], function(_, ComboToggle, sinon, Toggle, Collection, Model) {

  var MockToggle = function(opt_attrs) {
    var model = new Model(opt_attrs, {
      idAttribute: 'name'
    });

    model.select = jasmine.createSpy('MockToggle#select');
    model.deselect = jasmine.createSpy('MockToggle#deselect');
    model.toggle = jasmine.createSpy('MockToggle#toggle');

    return model;
  };

  function getToggleSet (opt_count, opt_attrs) {
    var toggles = [];
    var count = opt_count || 3;

    _.times(count, function() {
      toggles.push(new MockToggle(opt_attrs));
    });

    return toggles
  }

  describe('A ComboToggle', function() {

    describe('constructor', function() {

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

  });

});
