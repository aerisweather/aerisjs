define([
  'aeris/util',
  'aeris/builder/maps/fullscreen/controllers/fullscreenbtncontroller',
  'aeris/events',
  'mocks/aeris/builder/maps/fullscreen/helpers/fullscreenservice'
], function(_, FullscreenBtnController, Events, MockFullscreenService) {
  var template = '<div><span></span></div>';
  var FULLSCREEN_CLASS_STUB = 'FULLSCREEN_CLASS_STUB', EXIT_FULLSCREEN_CLASS_STUB = 'EXIT_FULLSCREEN_CLASS_STUB';

  var toHaveCssClass= function(cssClass) {
    var $el = this.actual;
    var elName = !!$el.selector ? $el.selector : $el.prop("tagName").toLowerCase();
    var hasCssClass = $el.hasClass(cssClass);

    this.message = this.isNot ?
      function() {
        return 'Expected element \'' + elName + '\' not to have class ' + cssClass + '. ' +
          'Element has classes: ' + $el.attr('class');
      } : function() {
        return 'Expected element \'' + elName + '\' to have class ' + cssClass + '. ' +
          'Element has classes: ' + $el.attr('class');
      };


    return hasCssClass;
  }

  describe('A FullscreenBtnController', function() {
    var fullscreenBtnController, eventHub, fullscreenService;
    var fullscreenStyle;

    beforeEach(function() {
      fullscreenStyle = {
        STUB: 'FULL_SCREEN_STYLE'
      };
      eventHub = new Events();
      fullscreenService = new MockFullscreenService();

      fullscreenBtnController = new FullscreenBtnController({
        className: 'FULLSCREEN_BTN_EL',
        template: template,
        fullscreenStyle: fullscreenStyle,
        eventHub: eventHub,
        fullscreenClass: FULLSCREEN_CLASS_STUB,
        exitFullscreenClass: EXIT_FULLSCREEN_CLASS_STUB,
        fullscreenService: fullscreenService
      });

      this.addMatchers({
        toHaveCssClass: toHaveCssClass
      });
    });

    describe('render', function() {

      beforeEach(function() {
        fullscreenBtnController.render();
      });

      it('should apply the fullscreenClass css class to the fullscreenBtn', function() {
        expect(fullscreenBtnController.$el).toHaveCssClass(FULLSCREEN_CLASS_STUB);
      });

      it('should not apply the exitFullscreenClass css class to the fullscreenBtn', function() {
        expect(fullscreenBtnController.$el).not.toHaveCssClass(EXIT_FULLSCREEN_CLASS_STUB);
      });

    });

    describe('UI Event bindings', function() {

      beforeEach(function() {
        fullscreenBtnController.render();
      });


      describe('on fullscreenBtn click', function() {
        
        it('should toggle the fullscreen/exitFullscreen css classes on the fullscreenBtn', function() {
          expect(fullscreenBtnController.$el).toHaveCssClass(FULLSCREEN_CLASS_STUB);

          // In full screen mode
          // --> Show exit fullscreen button
          fullscreenBtnController.$el.trigger('click');
          expect(fullscreenBtnController.$el).toHaveCssClass(EXIT_FULLSCREEN_CLASS_STUB);
          expect(fullscreenBtnController.$el).not.toHaveCssClass(FULLSCREEN_CLASS_STUB);

          // In regular mode
          // --> Show fullscreen button
          fullscreenBtnController.$el.trigger('click');
          expect(fullscreenBtnController.$el).toHaveCssClass(FULLSCREEN_CLASS_STUB);
          expect(fullscreenBtnController.$el).not.toHaveCssClass(EXIT_FULLSCREEN_CLASS_STUB);

          // In full screen mode
          // --> Show exit fullscreen button
          fullscreenBtnController.$el.trigger('click');
          expect(fullscreenBtnController.$el).toHaveCssClass(EXIT_FULLSCREEN_CLASS_STUB);
          expect(fullscreenBtnController.$el).not.toHaveCssClass(FULLSCREEN_CLASS_STUB);
        });
        
      });
      
      
      describe('fullscreen:request', function() {
        var onFullscreenRequest;

        beforeEach(function() {
          onFullscreenRequest = jasmine.createSpy('onFullscreenRequest');
          eventHub.on('fullscreen:request', onFullscreenRequest);
        });


        it('should trigger every 2n+1 times the fullscreenBtn is clicked', function() {
          // Enter fullscreen
          fullscreenBtnController.$el.trigger('click');
          expect(onFullscreenRequest.callCount).toEqual(1);
          
          // Exit fullscreen
          fullscreenBtnController.$el.trigger('click');
          expect(onFullscreenRequest.callCount).toEqual(1);
          
          // Enter fullscreen
          fullscreenBtnController.$el.trigger('click');
          expect(onFullscreenRequest.callCount).toEqual(2);

          // Exit fullscreen
          fullscreenBtnController.$el.trigger('click');
          expect(onFullscreenRequest.callCount).toEqual(2);
        });

        it('should pass the fullscreenStyle object', function() {
          fullscreenBtnController.$el.trigger('click');

          expect(onFullscreenRequest).toHaveBeenCalledWith(fullscreenStyle);
        });

      });
      
      
      describe('exitFullscreen:request', function() {
        var onExitFullscreenRequest;
        
        beforeEach(function() {
          onExitFullscreenRequest = jasmine.createSpy('onExitFullscreenRequest');
          eventHub.on('exitFullscreen:request', onExitFullscreenRequest);
        });
        
        
        it('should trigger every 2n times the fullscreenBtn is clicked', function() {
          // Enter fullscreen
          fullscreenBtnController.$el.trigger('click');
          expect(onExitFullscreenRequest.callCount).toEqual(0);

          // Exit fullscreen
          fullscreenBtnController.$el.trigger('click');
          expect(onExitFullscreenRequest.callCount).toEqual(1);

          // Enter fullscreen
          fullscreenBtnController.$el.trigger('click');
          expect(onExitFullscreenRequest.callCount).toEqual(1);

          // Exit fullscreen
          fullscreenBtnController.$el.trigger('click');
          expect(onExitFullscreenRequest.callCount).toEqual(2);
        });
        
        
      })

    });

  });

});
