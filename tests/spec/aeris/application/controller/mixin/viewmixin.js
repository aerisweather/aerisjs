define([
  'aeris/util',
  'application/controller/mixin/viewmixin',
  'vendor/marionette'
], function(_, ViewMixin, Marionette) {
  var ConcreteView = function() {
    this.ui = {
      'someButton': 'button'
    };

    Marionette.View.apply(this, arguments);
  };
  _.inherits(ConcreteView, Marionette.View);
  _.extend(ConcreteView.prototype, ViewMixin);


  describe('A ViewMixin', function() {

    describe('bindUIEvent', function() {
      var stubbedFn = function() { return 'foo'; };

      beforeEach(function() {
        spyOn(Marionette.View.prototype, 'delegateEvents');
      });

      it('should delegate events using the ui selector, (before binding)', function() {
        var view = new ConcreteView();
        view.bindUIEvent('click', 'someButton', stubbedFn);

        expect(view.delegateEvents).toHaveBeenCalledWith({
          'click button': stubbedFn
        });
      });

      it('should delegate events using the ui selector (after binding)', function() {
        var view = new ConcreteView();
        view.bindUIEvent('click', 'someButton', stubbedFn);

        view.bindUIElements();

        expect(view.delegateEvents).toHaveBeenCalledWith({
          'click button': stubbedFn
        });
      });

      it('should throw an error if the selector does not exist', function() {
        var view = new ConcreteView();

        // Reset delegateEvents spy
        view.delegateEvents = jasmine.createSpy('delegateEvents');

        expect(function() {
          view.bindUIEvent('submit', 'someForm', stubbedFn);
        }).toThrowType('InvalidArgumentError');

        expect(view.delegateEvents).not.toHaveBeenCalled();
      });

    });


  });

});
