define([
  'aeris/util',
  'aeris/promise',
  'aeris/maps/animations/autoupdateanimation',
  'mocks/aeris/maps/animations/helpers/animationlayerloader',
  'tests/lib/clock',
  'mocks/aeris/maps/layers/aeristile'
], function(_, Promise, AutoUpdateAnimation, MockAnimationLayerLoader, clock, MockAerisTile) {

  describe('AutoUpdateAnimation', function() {
    var autoUpdateAnimation, animationLayerLoader, AnimationLayerLoaderFactory, masterLayer;
    var LIMIT_STUB = 20, TIMESPAN_STUB = 100;


    beforeEach(function() {
      clock.useFakeTimers(TIMESPAN_STUB + 1000000);
    });
    afterEach(function() {
      clock.restore();
    });

    beforeEach(function() {
      masterLayer = new MockAerisTile();

      animationLayerLoader = new MockAnimationLayerLoader();
      AnimationLayerLoaderFactory = jasmine.createSpy('AnimationLayerLoaderFactory').
        andReturn(animationLayerLoader);

      spyOn(AutoUpdateAnimation.prototype, 'loadAnimationLayers').
        andCallThrough();

      autoUpdateAnimation = new AutoUpdateAnimation(masterLayer, {
        limit: LIMIT_STUB,
        timespan: TIMESPAN_STUB,
        AnimationLayerLoader: AnimationLayerLoaderFactory
      });
    });


    describe('constructor', function() {

      it('should set `to` to the current time', function() {
        expect(autoUpdateAnimation.getTo().getTime()).toEqual(Date.now());
      });

      it('should set `from` to (current time - timespan)', function() {
        var timespanAgo = Date.now() - TIMESPAN_STUB;

        expect(autoUpdateAnimation.getFrom().getTime()).toEqual(timespanAgo);
      });

      it('should load layers using the animation\'s from/to times, and limit', function() {
        expect(AnimationLayerLoaderFactory).toHaveBeenCalledWith(masterLayer, {
          limit: LIMIT_STUB,
          to: autoUpdateAnimation.getTo().getTime(),
          from: autoUpdateAnimation.getFrom().getTime()
        });

        expect(autoUpdateAnimation.loadAnimationLayers).toHaveBeenCalled();
      });

    });


    describe('on the masterLayer#autoUpdate event', function() {

      beforeEach(function() {
        // ...and some time passes
        clock.tick(Math.round(Math.random() * 10000));
      });


      it('should set `to` as the current time', function() {
        spyOn(autoUpdateAnimation, 'setTo');
        masterLayer.trigger('autoUpdate');

        expect(autoUpdateAnimation.setTo).toHaveBeenCalledWith(Date.now());
      });

      it('should set `from` as (current time - timespan)', function() {
        var timespanAgo = Date.now() - TIMESPAN_STUB;
        spyOn(autoUpdateAnimation, 'setFrom');

        masterLayer.trigger('autoUpdate');

        expect(autoUpdateAnimation.setFrom).toHaveBeenCalledWith(timespanAgo);
      });

      it('should update the animationLayerLoader\'s from and to settings', function() {
        // reset our spies
        animationLayerLoader.setFrom = jasmine.createSpy('setFrom');
        animationLayerLoader.setTo = jasmine.createSpy('setTo');

        masterLayer.trigger('autoUpdate');

        expect(animationLayerLoader.setFrom).toHaveBeenCalledWith(autoUpdateAnimation.getFrom().getTime());
        expect(animationLayerLoader.setTo).toHaveBeenCalledWith(autoUpdateAnimation.getTo().getTime());
      });

      it('should load time layers', function() {
        // reset loadAnimLayers spy
        autoUpdateAnimation.loadAnimationLayers = jasmine.createSpy('loadAnimationLayers').
          andReturn(new Promise());

        masterLayer.trigger('autoUpdate');
        expect(autoUpdateAnimation.loadAnimationLayers).toHaveBeenCalled();
      });

      it('should trigger an autoUpdate event', function() {
        var onAutoUpdate = jasmine.createSpy('onAutoUpdate');
        autoUpdateAnimation.on('autoUpdate', onAutoUpdate);

        masterLayer.trigger('autoUpdate');

        expect(onAutoUpdate).toHaveBeenCalled();
      });

    });

  });

});
