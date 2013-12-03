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

    describe('bindUIEvent', function() {
      var ConcreteViewWithUI = function() {
        this.ui = {
          'someButton': 'button'
        };

        ConcreteView.apply(this, arguments);
      };
      _.inherits(ConcreteViewWithUI, ConcreteView);
      
      var stubbedFn = function() { return 'foo'; };

      beforeEach(function() {
        spyOn(Marionette.View.prototype, 'delegateEvents');
      });

      it('should delegate events using the ui selector, (before binding)', function() {
        var view = new ConcreteViewWithUI();
        view.bindUIEvent('click', 'someButton', stubbedFn);

        expect(view.delegateEvents).toHaveBeenCalledWith({
          'click button': stubbedFn
        });
      });

      it('should delegate events using the ui selector (after binding)', function() {
        var view = new ConcreteViewWithUI();
        view.bindUIEvent('click', 'someButton', stubbedFn);

        view.bindUIElements();

        expect(view.delegateEvents).toHaveBeenCalledWith({
          'click button': stubbedFn
        });
      });

      it('should throw an error if the selector does not exist', function() {
        var view = new ConcreteViewWithUI();

        // Reset delegateEvents spy
        view.delegateEvents = jasmine.createSpy('delegateEvents');

        expect(function() {
          view.bindUIEvent('submit', 'someForm', stubbedFn);
        }).toThrowType('InvalidArgumentError');

        expect(view.delegateEvents).not.toHaveBeenCalled();
      });

    });
    
    describe('declareUI', function() {
      var $el, $button, $form, $div;

      beforeEach(function() {
        $button = $('<button></button>').addClass('btnSelector');
        $form = $('<form></form>').addClass('formSelector');
        $div = $('<div></div>').addClass('divSelector');

        $el = $('<div></div>').
          append($button).
          append($form).
          append($div);
      });

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
