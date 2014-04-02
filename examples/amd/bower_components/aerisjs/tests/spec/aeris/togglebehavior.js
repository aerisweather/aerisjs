define([
  'aeris/util',
  'aeris/togglebehavior',
  'aeris/model'
], function(_, ToggleBehavior, Model) {
  var ConcreteToggle = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      selected: false
    });

    Model.call(this, attrs, opt_options);
    ToggleBehavior.call(this);
  };
  _.inherits(ConcreteToggle, Model);
  _.extend(ConcreteToggle.prototype, ToggleBehavior.prototype);


  describe('ToggleBehavior', function() {
    var toggle;

    beforeEach(function() {
      toggle = new ConcreteToggle();
    });


    describe('Events', function() {

      describe('select', function() {
        var onSelect;

        beforeEach(function() {
          onSelect = jasmine.createSpy('onSelect');
          toggle.on('select', onSelect);
        });


        it('should fire when selected', function() {
          toggle.select();

          expect(onSelect).toHaveBeenCalled();
        });

        it('should not fire if the model is already selected', function() {
          toggle.select();
          toggle.select();

          expect(onSelect.callCount).toEqual(1);
        });

        it('should provide the selected model', function() {
          toggle.select();

          expect(onSelect).toHaveBeenCalledWith(toggle);
        });

      });

      describe('deselect', function() {
        var onDeselect;

        beforeEach(function() {
          toggle.select();
          onDeselect = jasmine.createSpy('onDeselect');
          toggle.on('deselect', onDeselect);
        });


        it('should fire when deselected', function() {
          toggle.deselect();

          expect(onDeselect).toHaveBeenCalled();
        });

        it('should not fire if already deselected', function() {
          toggle.deselect();
          toggle.deselect();

          expect(onDeselect.callCount).toEqual(1);
        });

        it('should provide the deselected model', function() {
          toggle.deselect();

          expect(onDeselect).toHaveBeenCalledWith(toggle);
        });

      });

    });


    describe('toggle', function() {

      it('should toggle the selected state', function() {
        toggle.toggle();
        expect(toggle.isSelected()).toEqual(true);

        toggle.toggle();
        expect(toggle.isSelected()).toEqual(false);

        toggle.toggle();
        expect(toggle.isSelected()).toEqual(true);
      });

    });

  });

});
