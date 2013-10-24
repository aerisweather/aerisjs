define([
  'aeris/util',
  'application/form/model/toggle',
  'application/form/controller/togglebuttoncontroller'
], function(_, Toggle, ToggleButtonController) {

  describe('A ToggleButtonController', function() {

    describe('constructor', function() {

      it('should set the selected class based on the models selected attribute', function() {
        var selectedController = new ToggleButtonController({
          selectedClass: 'selected',
          model: new Toggle({ selected: true })
        });
        var deselectedController = new ToggleButtonController({
          selectedClass: 'selected',
          model: new Toggle({ selected: false })
        });

        selectedController.render();
        deselectedController.render();

        expect(selectedController.ui.btn.hasClass('selected')).toEqual(true);
        expect(deselectedController.ui.btn.hasClass('selected')).toEqual(false);
      });

      describe('DOM event bindings', function() {

        it('should set the models selected attribute when the button is clicked', function() {
          var model = new Toggle({ selected: false });
          var controller = new ToggleButtonController({
            model: model
          });

          controller.render();

          controller.ui.btn.trigger('click');
          expect(model.get('selected')).toEqual(true);

          controller.ui.btn.trigger('click');
          expect(model.get('selected')).toEqual(false);

          controller.ui.btn.trigger('click');
          expect(model.get('selected')).toEqual(true);
        });

      });

      describe('Model event bindings', function() {

        it('should set the button\'s selected class when the model\'s selected attribute changes', function() {
          var model = new Toggle({ selected: false });
          var controller = new ToggleButtonController({
            model: model,
            selectedClass: 'selected',
            deselectedClass: 'deselected'
          });

          controller.render();

          model.select();
          expect(controller.ui.btn.hasClass('selected')).toEqual(true);
          expect(controller.ui.btn.hasClass('deselected')).toEqual(false);

          model.deselect();
          expect(controller.ui.btn.hasClass('selected')).toEqual(false);
          expect(controller.ui.btn.hasClass('deselected')).toEqual(true);

          model.select();
          expect(controller.ui.btn.hasClass('selected')).toEqual(true);
          expect(controller.ui.btn.hasClass('deselected')).toEqual(false);
        });

      });

    });

  });

});
