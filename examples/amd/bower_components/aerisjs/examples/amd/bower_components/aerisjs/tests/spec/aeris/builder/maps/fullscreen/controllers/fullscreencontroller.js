define([
  'aeris/util',
  'aeris/builder/maps/fullscreen/controllers/fullscreencontroller',
  'jquery',
  'mocks/aeris/builder/maps/fullscreen/helpers/fullscreenservice'
], function(_, FullscreenController, $, MockFullscreenService) {

  var toHaveStyle = function(styleProp, styleVal) {
    var $el = this.actual;
    var elStyles = $el[0].style.cssText;
    var elName = $el.selector || $el.prop('tagName');

    // Match against element style attr (string)
    var stylePattern = new RegExp(styleProp + ':\\s*' + styleVal, 'g');      // eg. /margin-left:\s*12px/g

    this.message = this.isNot ?
      function() {
        return 'Expected \'' + elName + '\' not to have styles: ' +
          '\'' + styleProp + ': ' + styleVal + '\'. ';
      } :
      function() {
        return 'Expected \'' + elName + '\' to have styles: ' +
          '\'' + styleProp + ': ' + styleVal + '\'. ' +
          'Actual element styles: ' + elStyles + '.';
      };

    return stylePattern.test(elStyles);
  };


  function stylesToString(styleObj) {
    return _.reduce(styleObj, function(styleStr, styleVal, styleProp) {
      var currStyleStr = '{prop}: {val}; '.
        replace('{prop}', styleProp).
        replace('{val}', styleVal);

      return styleStr + currStyleStr;
    }, '');
  }


  describe('A FullscreenController', function() {
    var fullscreenController, $el, mockFullscreenService;
    var STYLE_ORIG_STUB, STYLE_FULLSCREEN_STUB;

    beforeEach(function() {
      mockFullscreenService = new MockFullscreenService();

      STYLE_ORIG_STUB = {
        'margin-left': '12px',
        color: 'red',
        height: '12.345%',
        position: 'relative'
      };
      STYLE_FULLSCREEN_STUB = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        'text-align': 'center'
      };

      $el = $('<div></div>').
        attr('style', stylesToString(STYLE_ORIG_STUB));

      spyOn($el, 'css').andCallThrough();

      fullscreenController = new FullscreenController({
        el: $el,
        fullscreenService: mockFullscreenService
      });


      this.addMatchers({
        toHaveStyle: toHaveStyle
      });
    });


    describe('enterFullscreen', function() {


      describe('if the fullscreen api is supported', function() {

        beforeEach(function() {
          mockFullscreenService.isSupported.andReturn(true);
        });


        it('should request fullscreen on the view element', function() {
          fullscreenController.enterFullscreen();

          expect(mockFullscreenService.requestFullscreen).toHaveBeenCalledWith(fullscreenController.el);
        });


      });



      describe('if the fullscreen api is not supported', function() {

        beforeEach(function() {
          mockFullscreenService.isSupported.andReturn(false);
        });


        it('should add fullscreen styles to the $el, overriding any existing style', function() {
          fullscreenController.enterFullscreen(STYLE_FULLSCREEN_STUB);

          _.each(STYLE_FULLSCREEN_STUB, function(styleVal, styleProp) {
            expect(fullscreenController.$el).toHaveStyle(styleProp, styleVal);
          });
        });

        it('should remove previous styles', function() {
          fullscreenController.enterFullscreen(STYLE_FULLSCREEN_STUB);

          _.each(STYLE_ORIG_STUB, function(styleVal, styleProp) {
            expect(fullscreenController.$el).not.toHaveStyle(styleProp, styleVal);
          });
        });

        it('should not require styles, and set default fullscreen styles', function() {
          var expectedDefaultStyles = {
            position: 'fixed',
            width: '100%', height: '100%',
            top: 0, bottom: 0,
            left: 0, right: 0,
            padding: 0, margin: 0
          };

          fullscreenController.enterFullscreen();


          expect(fullscreenController.$el.css).toHaveBeenCalledWith(expectedDefaultStyles);
        });

      });

    });


    describe('exitFullscreen', function() {


      describe('if the fullscreen api is supported', function() {

        beforeEach(function() {
          mockFullscreenService.isSupported.andReturn(true);
        });


        it('should exit fullscreen, using the fullscreenService', function() {
          fullscreenController.exitFullscreen();

          expect(mockFullscreenService.exitFullscreen).toHaveBeenCalled();
        });

      });



      describe('if fullscreen api is not supported', function() {

        beforeEach(function() {
          mockFullscreenService.isSupported.andReturn(false);
        });



        describe('after calling enterFullscreen', function() {

          beforeEach(function() {
            fullscreenController.enterFullscreen(STYLE_FULLSCREEN_STUB);
          });


          it('should restore the overrided styles of the element', function() {
            fullscreenController.exitFullscreen();

            _.each(STYLE_ORIG_STUB, function(styleVal_orig, styleProp_orig) {
              expect(fullscreenController.$el).toHaveStyle(styleProp_orig, styleVal_orig);
            });
          });

          it('should remove added style properties from the element', function() {
            var addedFullscreenProps = _.difference(_.keys(STYLE_FULLSCREEN_STUB), _.keys(STYLE_ORIG_STUB));

            fullscreenController.exitFullscreen();

            addedFullscreenProps.forEach(function(addedProp) {
              expect(fullscreenController.$el).not.toHaveStyle(addedProp, STYLE_FULLSCREEN_STUB[addedProp]);
            });
          });

        });


        it('should remove all styles, if no style attribute was originally defined', function() {
          var hasStyleAttr;

          fullscreenController.$el.removeAttr('style');
          fullscreenController.enterFullscreen();

          fullscreenController.exitFullscreen();

          hasStyleAttr = !!fullscreenController.$el.attr('style') || !!fullscreenController.$el.attr('style').length;
          expect(hasStyleAttr).toEqual(false);
        });

        it('should have no effect, if fullscreen has not been called.', function() {
          fullscreenController.exitFullscreen();

          _.each(STYLE_ORIG_STUB, function(styleVal_orig, styleProp_orig) {
            expect(fullscreenController.$el).toHaveStyle(styleProp_orig, styleVal_orig);
          });
        });


      });

    });

  });


});
