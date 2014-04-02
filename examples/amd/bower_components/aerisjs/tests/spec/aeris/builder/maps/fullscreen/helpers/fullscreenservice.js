define([
  'aeris/util',
  'aeris/builder/maps/fullscreen/helpers/fullscreenservice',
  'aeris/events'
], function(_, FullscreenService, Events) {

  var Prefix = {
    NONE: 'NONE',
    MS: 'MS',
    MOZ: 'MOZ',
    WEBKIT: 'WEBKIT'
  };

  /**
   *
   * @constructor
   * @extends HTMLElement
   */
  var MockFullscreenElement = function() {
    this.enterFullscreenSpy = null;
    this.exitFullscreenSpy = null;

    Events.call(this);
  };
  _.extend(MockFullscreenElement.prototype, Events.prototype);

  MockFullscreenElement.prototype.enableFullscreenMode = function(opt_prefix) {
    this.enableEnterFullscreenMode(opt_prefix);
    this.enableExitFullscreenMode(opt_prefix);
  };

  MockFullscreenElement.prototype.enableExitFullscreenMode = function(opt_prefix) {
    var prefix = opt_prefix || Prefix.NONE;
    var exitFullscreenApi = MockFullscreenElement.ExitFullscreenApiLookup_[prefix];

    this[exitFullscreenApi] = jasmine.createSpy('-' + prefix + '-' + 'exitFullscreenApi');
    this.exitFullscreenSpy = this[exitFullscreenApi];
  };

  MockFullscreenElement.prototype.enableEnterFullscreenMode = function(opt_prefix) {
    var prefix = opt_prefix || Prefix.NONE;
    var enterFullscreenApi = MockFullscreenElement.EnterFullscreenApiLookup_[prefix];

    this[enterFullscreenApi] = jasmine.createSpy('-' + prefix + '-' + 'enterFullscreenApi');
    this.enterFullscreenSpy = this[enterFullscreenApi];
  };

  MockFullscreenElement.prototype.disableFullscreenMode = function(opt_prefix) {
    var enterApiMethod, exitApiMethod;

    if (opt_prefix) {
      enterApiMethod = MockFullscreenElement.EnterFullscreenApiLookup_[opt_prefix];
      exitApiMethod = MockFullscreenElement.ExitFullscreenApiLookup_[opt_prefix];

      this.disableApiMethod_(enterApiMethod);
      this.disableApiMethod_(exitApiMethod);
    }
    else {
      this.disableFullscreenModeForAllPrefixes_();
    }

    this.enterFullscreenSpy = null;
    this.exitFullscreenSpy = null;
  };

  /** @private */
  MockFullscreenElement.prototype.disableFullscreenModeForAllPrefixes_ = function() {
    _.each(MockFullscreenElement.EnterFullscreenApiLookup_, this.disableApiMethod_, this);
    _.each(MockFullscreenElement.ExitFullscreenApiLookup_, this.disableApiMethod_, this);
  }

  /** @private */
  MockFullscreenElement.prototype.disableApiMethod_ = function(apiMethod) {
    if (this[apiMethod]) { delete this[apiMethod] }
  };

  MockFullscreenElement.prototype.addEventListener = function(topic, cb) {
    this.on(topic, cb, this);
  };


  MockFullscreenElement.prototype.triggerMockEvent = function(topic, var_args) {
    this.trigger.apply(this, arguments);
  };

  MockFullscreenElement.EnterFullscreenApiLookup_ = {};
  MockFullscreenElement.EnterFullscreenApiLookup_[Prefix.NONE] = 'requestFullscreen';
  MockFullscreenElement.EnterFullscreenApiLookup_[Prefix.MS] = 'msRequestFullscreen';
  MockFullscreenElement.EnterFullscreenApiLookup_[Prefix.MOZ] = 'mozRequestFullScreen';
  MockFullscreenElement.EnterFullscreenApiLookup_[Prefix.WEBKIT] = 'webkitRequestFullscreen';

  MockFullscreenElement.ExitFullscreenApiLookup_ = {};
  MockFullscreenElement.ExitFullscreenApiLookup_[Prefix.NONE] = 'exitFullscreen';
  MockFullscreenElement.ExitFullscreenApiLookup_[Prefix.MS] = 'msExitFullscreen';
  MockFullscreenElement.ExitFullscreenApiLookup_[Prefix.MOZ] = 'mozCancelFullScreen';
  MockFullscreenElement.ExitFullscreenApiLookup_[Prefix.WEBKIT] = 'webkitExitFullscreen';



  describe('A FullscreenService', function() {
    var mockDocument, mockBody, fullscreenService;

    beforeEach(function() {
      mockBody = new MockFullscreenElement();
      mockDocument = new MockFullscreenElement();

      mockDocument.body = mockBody;

      fullscreenService = new FullscreenService({
        document: mockDocument
      });
    });


    
    describe('requestFullscreen', function() {
      var mockElement;

      beforeEach(function() {
        mockElement = new MockFullscreenElement();
        mockElement.enableFullscreenMode(Prefix.NONE);
        fullscreenService.requestFullscreen(mockElement);
      });

      
      it('should requestFullscreen on the element', function() {
        mockElement.enableEnterFullscreenMode();

        fullscreenService.requestFullscreen(mockElement);

        expect(mockElement.enterFullscreenSpy).toHaveBeenCalled();
        expect(mockElement.enterFullscreenSpy).toHaveBeenCalledInTheContextOf(mockElement);
      });
      
      it('should use any prefixed requestFullscreen api available', function() {
        _.each(Prefix, function(prefix) {
          // Enable only this prefix
          mockElement.disableFullscreenMode();
          mockElement.enableEnterFullscreenMode(prefix);

          fullscreenService.requestFullscreen(mockElement);

          expect(mockElement.enterFullscreenSpy).toHaveBeenCalled();
        });
      });
      
      it('should prefer \'requestFullscreen\' api over prefixed apis', function() {
        // Enable all prefixed api method
        _.each(Prefix, mockElement.enableEnterFullscreenMode, mockElement);

        fullscreenService.requestFullscreen(mockElement);

        expect(mockElement.requestFullscreen).toHaveBeenCalled();
      });
      
      it('should throw a \'FullscreenNotSupportedError\' error, if no exit fullscreen api is available', function() {
        mockElement.disableFullscreenMode();

        expect(function() {
          fullscreenService.requestFullscreen(mockElement);
        }).toThrowType('FullscreenNotSupportedError');
      });
      
    });
    
    
    describe('exitFullscreen', function() {
      
      it('should exit fullscreen on the document', function() {
        mockDocument.enableExitFullscreenMode();

        fullscreenService.exitFullscreen();

        expect(mockDocument.exitFullscreenSpy).toHaveBeenCalled();
        expect(mockDocument.exitFullscreenSpy).toHaveBeenCalledInTheContextOf(mockDocument);
      });
      
      it('should use any prefixed exitFullscreen api available', function() {
        _.each(Prefix, function(prefix) {
          mockDocument.disableFullscreenMode();
          mockDocument.enableExitFullscreenMode(prefix);

          fullscreenService.exitFullscreen();

          expect(mockDocument.exitFullscreenSpy).toHaveBeenCalled();
        })
      });
      
      it('should prefer \'exitFullscreen\' over prefixed apis', function() {
        // Enable all prefixed methods
        _.each(Prefix, mockDocument.enableExitFullscreenMode, mockDocument);

        fullscreenService.exitFullscreen();

        expect(mockDocument.exitFullscreen).toHaveBeenCalled();
      });
      
      it('should throw a \'FullscreenNotSupportedError\' error, if no exitFullscreen api is available', function() {
        mockDocument.disableFullscreenMode();

        expect(function() {
          fullscreenService.exitFullscreen();
        }).toThrowType('FullscreenNotSupportedError');
      });
      
    });
    
    
    describe('isSupported', function() {

      it('should return true if any fullscreen api is available for the document\'s body element', function() {
        _.each(Prefix, function(prefix) {
          mockBody.disableFullscreenMode();
          mockBody.enableFullscreenMode(prefix);

          expect(fullscreenService.isSupported()).toEqual(true);
        });
      });
      
      it('should return false if no fullscreen api is available for the document\'s body element', function() {
        mockBody.disableFullscreenMode();

        expect(fullscreenService.isSupported()).toEqual(false);
      });
      
    });
    
    
    describe('Events', function() {
      var mockElement;
      var vendorFullscreenChangeEvents = [
        'fullscreenchange',
        'mozfullscreenchange',
        'webkitfullscreenchange',
        'msfullscreenchange'
      ];
      var vendorIsFullScreenProps = [
        'fullscreen',
        'mozFullScreen',
        'webkitIsFullScreen',
        'msFullscreenElement'
      ];

      beforeEach(function() {

        mockElement = new MockFullscreenElement();
        mockElement.enableFullscreenMode();
        mockDocument.enableFullscreenMode();

        mockDocument.triggerEnterFullscreen = function() {
          _.each(vendorIsFullScreenProps, function(isFullScreenProp) {
            this[isFullScreenProp] = true;
          }, this);

          _.each(vendorFullscreenChangeEvents, function(changeEvent) {
            this.triggerMockEvent(changeEvent);
          }, this);
        };
        mockDocument.triggerExitFullscreen = function() {
          _.each(vendorIsFullScreenProps, function(isFullScreenProp) {
            this[isFullScreenProp] = false;
          }, this);

          _.each(vendorFullscreenChangeEvents, function(changeEvent) {
            this.triggerMockEvent(changeEvent);
          }, this);
        }
      });

      
      
      describe('fullscreen:change', function() {
        var onFullscreenChange;

        beforeEach(function() {
          onFullscreenChange = jasmine.createSpy('onFullscreenChange');
          fullscreenService.on('fullscreen:change', onFullscreenChange);
        });


        it('should emit whenever fullscreen events are fired on the document', function() {
          mockDocument.triggerEnterFullscreen();
          expect(onFullscreenChange).toHaveBeenCalled();

          mockDocument.triggerExitFullscreen();
          expect(onFullscreenChange).toHaveBeenCalled();
        });

        it('should only fire once for multiple vendor prefixes', function() {
          mockDocument.triggerEnterFullscreen();

          expect(onFullscreenChange.callCount).toEqual(1);
        });

        describe('isFullscreen event param', function() {

          it('should equal true if entering fullscreen', function() {
            mockDocument.triggerEnterFullscreen();
            expect(onFullscreenChange).toHaveBeenCalledWith(true);
          });

          it('should equal false is exiting fullscreen', function() {
            mockDocument.triggerExitFullscreen();
            expect(onFullscreenChange).toHaveBeenCalledWith(false);
          });

        });

      });
      
      
      describe('fullscreen:enter', function() {
        var onFullscreenEnter;

        beforeEach(function() {
          onFullscreenEnter = jasmine.createSpy('onFullscreenEnter');
          fullscreenService.on('fullscreen:enter', onFullscreenEnter);
        });


        it('should emit when entering fullscreen mode', function() {
          mockDocument.triggerEnterFullscreen();

          expect(onFullscreenEnter).toHaveBeenCalled();
        });

        it('should not emit when exiting fullscreen mode', function() {
          mockDocument.triggerExitFullscreen();

          expect(onFullscreenEnter).not.toHaveBeenCalled();
        });

      });
      
      
      describe('fullscreen:exit', function() {
        var onFullscreenExit;

        beforeEach(function() {
          onFullscreenExit = jasmine.createSpy('onFullscreenExit');
          fullscreenService.on('fullscreen:exit', onFullscreenExit);
        });


        it('should emit when exiting fullscreen mode', function() {
          mockDocument.triggerExitFullscreen();

          expect(onFullscreenExit).toHaveBeenCalled();
        });

        it('should not emit when entering fullscreen mode', function() {
          mockDocument.triggerEnterFullscreen();

          expect(onFullscreenExit).not.toHaveBeenCalled();
        });

      });
      
    });
    
  });
  
});
