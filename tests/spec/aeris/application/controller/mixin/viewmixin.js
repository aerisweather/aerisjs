define([
  'aeris/util',
  'application/controller/mixin/viewmixin',
  'vendor/marionette',
  'vendor/jquery',
  'application/controller/itemcontroller'
], function(_, ViewMixin, Marionette, $, ItemController) {
  var ConcreteView = function() {
    Marionette.View.apply(this, arguments);
  };
  _.inherits(ConcreteView, Marionette.View);
  _.extend(ConcreteView.prototype, ViewMixin);


  describe('A ViewMixin', function() {
    var $el, $button, $form, $div;
    var eventListener;

    beforeEach(function() {
      $button = $('<button></button>').addClass('btnSelector');
      $form = $('<form></form>').addClass('formSelector');
      $div = $('<div></div>').addClass('divSelector');

      $el = $('<div></div>').
        append($button).
        append($form).
        append($div);

      eventListener = jasmine.createSpy('eventListener')
    });



    describe('bindUIEvent', function() {

      it('should delegate events using the ui selector, (before binding)', function() {
        var view = new ConcreteView({
          el: $el
        });

        view.ui = {
          someButton: 'button'
        };

        view.bindUIEvent('click', 'someButton', eventListener);

        $button.trigger('click');

        expect(eventListener).toHaveBeenCalled();
        expect(eventListener.callCount).toEqual(1);
      });

      it('should delegate events using the ui selector (after binding UI)', function() {
        var view = new ConcreteView({
          el: $el
        });

        view.ui = {
          someButton: '.btnSelector'
        };

        view.bindUIElements();
        view.bindUIEvent('click', 'someButton', eventListener);

        $button.trigger('click');

        expect(eventListener).toHaveBeenCalled();
        expect(eventListener.callCount).toEqual(1);
      });

      it('should delegate events multiple times', function() {
        var view = new ConcreteView({
          el: $el
        });
        var listeners = jasmine.createSpyObj('listeners', [
          'form', 'button', 'div'
        ]);

        view.ui = {
          someButton: 'button',
          someForm: 'form',
          someDiv: 'div'
        };

        view.bindUIElements();
        view.bindUIEvent('click', 'someButton', listeners.button);
        view.bindUIEvent('click', 'someForm', listeners.form);
        view.bindUIEvent('click', 'someDiv', listeners.div);

        $button.trigger('click');
        expect(listeners.button).toHaveBeenCalled();

        $form.trigger('click');
        expect(listeners.form).toHaveBeenCalled();

        $div.trigger('click');
        expect(listeners.div).toHaveBeenCalled();

        expect(listeners.button.callCount).toEqual(1);
        expect(listeners.form.callCount).toEqual(1);
        expect(listeners.div.callCount).toEqual(1);
      });

      it('should throw an error if the selector does not exist', function() {
        var view = new ConcreteView({ el: $el });
        view.ui = {};

        expect(function() {
          view.bindUIEvent('submit', 'someForm', eventListener);
        }).toThrowType('InvalidArgumentError');
      });

      it('should not throw an error if the selector is empty', function() {
        var view = new ConcreteView();

        view.ui = {
          emptyUI: ''
        };

        // Show not throw an error
        view.bindUIEvent('click', 'emptyUI', eventListener);
      });

      it('should not bind events to the top-level view, if the selector is empty', function() {
        var view = new ConcreteView();

        view.ui = {
          emptyUI: ''
        };

        view.bindUIEvent('click', 'emptyUI', eventListener);

        view.render();
        view.$el.trigger('click');

        expect(eventListener).not.toHaveBeenCalled();
      });

      it('should bind the event in a specified context', function() {
        var view = new ConcreteView({ el: $el });
        var ctx = { foo: 'bar' };

        view.ui = {
          someButton: 'button'
        };

        view.bindUIEvent('click', 'someButton', eventListener, ctx);

        $button.trigger('click');

        expect(eventListener).toHaveBeenCalledInTheContextOf(ctx);
      });

      it('should undelegate the event with undelegateEvents', function() {
        var view = new ConcreteView({ el: $el });

        view.ui = {
          someButton: 'button'
        };

        view.bindUIEvent('click', 'someButton', eventListener);
        view.undelegateEvents();

        $button.trigger('click');

        expect(eventListener).not.toHaveBeenCalled();
      });

    });
    
    describe('declareUI', function() {

      it('should define an array of UI elements as empty strings', function() {
        var view = new ConcreteView();

        view.declareUI('someButton', 'someForm', 'someDiv');

        expect(view.ui).toEqual({
          someButton: '',
          someForm: '',
          someDiv: ''
        });
      });
      
      it('should not override existing UI elements', function() {
        var view = new ConcreteView();

        view.ui = {
          someButton: '.btnSelector',
          someForm: 'form.formSelector'
        };

        view.declareUI('someButton', 'someForm', 'someDiv');

        expect(view.ui).toEqual({
          someButton: '.btnSelector',
          someForm: 'form.formSelector',
          someDiv: ''
        });
      });
      
      it('should work after UI elements have been resolved', function() {
        var view = new ConcreteView();

        view.ui = {
          someButton: '.btnSelector',
          someForm: 'form.formSelector'
        };
        view.$el = $el;

        view.bindUIElements();

        view.declareUI('someButton', 'someForm', 'someDiv');

        view.bindUIElements();

        expect(view.ui.someButton[0]).toEqual($button[0]);
        expect(view.ui.someForm[0]).toEqual($form[0]);

        // Some div is an empty jQuery object.
        expect(view.ui.someDiv).toBeInstanceOf($);
        expect(view.ui.someDiv.length).toEqual(0);
      });
      
      describe('ItemController Integration Tests', function() {
        
        it('should aid in processing injected ui bindings', function() {
          var ChildController = function(options) {
            this.declareUI('someButton', 'someForm', 'someDiv');

            ItemController.call(this, options);
          };
          _.inherits(ChildController, ItemController);

          var controller = new ChildController({
            ui: {
              someButton: '.btnSelector',
              someForm: 'form.formSelector'
            }
          });

          expect(controller.ui).toEqual({
            someButton: '.btnSelector',
            someForm: 'form.formSelector',
            someDiv: ''
          });
        });
        
      });
      
    });


  });

});
