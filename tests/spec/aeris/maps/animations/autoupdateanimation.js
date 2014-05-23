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
    var LIMIT_STUB = 20, AUTO_UPDATE_INTERVAL_STUB = 111e15;
    var FROM_STUB = 123e3, TO_STUB = 789e3;


    beforeEach(function() {
      clock.useFakeTimers(1e10);
    });
    afterEach(function() {
      clock.restore();
    });

    beforeEach(function() {
      masterLayer = new MockAerisTile({
        autoUpdateInterval: AUTO_UPDATE_INTERVAL_STUB
      });

      animationLayerLoader = new MockAnimationLayerLoader();
      AnimationLayerLoaderFactory = jasmine.createSpy('AnimationLayerLoaderFactory').
        andReturn(animationLayerLoader);

      autoUpdateAnimation = new AutoUpdateAnimation(masterLayer, {
        limit: LIMIT_STUB,
        from: FROM_STUB,
        to: TO_STUB,
        AnimationLayerLoader: AnimationLayerLoaderFactory
      });
    });


    describe('on the masterLayer#autoUpdate event', function() {
      var promiseToLoadAnimationLayers;

      beforeEach(function() {
        promiseToLoadAnimationLayers = new Promise();

        spyOn(autoUpdateAnimation, 'setFrom').andCallThrough();
        spyOn(autoUpdateAnimation, 'setTo').andCallThrough();
        spyOn(autoUpdateAnimation, 'loadAnimationLayers').andReturn(promiseToLoadAnimationLayers);
      });


      it('should bump the time forward by the masterLayer\'s `autoUpdateInterval`', function() {
        masterLayer.trigger('autoUpdate');
        expect(autoUpdateAnimation.setFrom).toHaveBeenCalledWith(FROM_STUB + AUTO_UPDATE_INTERVAL_STUB);
        expect(autoUpdateAnimation.setTo).toHaveBeenCalledWith(TO_STUB + AUTO_UPDATE_INTERVAL_STUB);

        masterLayer.trigger('autoUpdate');
        expect(autoUpdateAnimation.setFrom).toHaveBeenCalledWith(FROM_STUB + AUTO_UPDATE_INTERVAL_STUB * 2);
        expect(autoUpdateAnimation.setTo).toHaveBeenCalledWith(TO_STUB + AUTO_UPDATE_INTERVAL_STUB * 2);
      });

      it('should reload animation layers', function() {
        masterLayer.trigger('autoUpdate');

        expect(autoUpdateAnimation.loadAnimationLayers).toHaveBeenCalled();
      });

      it('should emit an `autoUpdate` event after times are loaded', function() {
        var onAutoUpdate = jasmine.createSpy('onAutoUpdate');
        autoUpdateAnimation.on('autoUpdate', onAutoUpdate);

        masterLayer.trigger('autoUpdate');
        expect(onAutoUpdate).not.toHaveBeenCalled();

        promiseToLoadAnimationLayers.resolve([]);
        expect(onAutoUpdate).toHaveBeenCalled();
      });

    });

  });

});
