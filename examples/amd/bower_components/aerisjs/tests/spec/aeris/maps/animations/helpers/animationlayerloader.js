define([
  'aeris/util',
  'aeris/maps/animations/helpers/animationlayerloader',
  'aeris/model',
  'aeris/promise',
  'mocks/aeris/maps/animations/helpers/times'
], function(_, AnimationLayerLoader, Model, Promise, MockTimes) {

  var MockLayer = function() {
    Model.apply(this, arguments);

    this.promiseToLoadTimes_;
    this.isLoaded_ = false;
  };
  _.inherits(MockLayer, Model);


  MockLayer.prototype.loadTileTimes = function() {
    this.promiseToLoadTimes_ = new Promise();

    return this.promiseToLoadTimes_;
  };


  MockLayer.prototype.resolveTileTimes = function(times) {
    this.promiseToLoadTimes_.resolve(times);
  };


  MockLayer.prototype.rejectTileTimes = function(err) {
    this.promiseToLoadTimes_.reject(err);
  };


  MockLayer.prototype.markAsLoaded = function() {
    this.isLoaded_ = true;
    this.trigger('load');
  };


  MockLayer.prototype.isLoaded = function() {
    return !!this.isLoaded_;
  };


  var MockTimeLayersFactory = function(opt_count) {
    spyOn(this, 'createTimeLayers').andCallThrough();
  };

  MockTimeLayersFactory.prototype.setTimes = function(times) {
    this.times_ = times;
  };

  MockTimeLayersFactory.prototype.createTimeLayers = function() {
    var stubbedLayers = {};

    _.each(this.times_, function(time) {
      stubbedLayers[time] = new MockLayer({
        time: new Date(time)
      });
    }, this);

    this.stubbedLayers_ = stubbedLayers;

    return this.stubbedLayers_;
  };

  MockTimeLayersFactory.prototype.getStubbedLayers = function() {
    if (!this.stubbedLayers_) {
      throw new Error('No stubbed layers time-layers have been created');
    }

    return this.stubbedLayers_;
  };


  describe('An AnimationLayerLoader', function() {
    var loader, baseLayer, options, timeLayersFactory, times;
    var LAYER_COUNT = 10;

    beforeEach(function() {
      times = new MockTimes();
      baseLayer = new MockLayer();
      timeLayersFactory = new MockTimeLayersFactory(LAYER_COUNT);
      options = {
        limit: 'LIMIT_STUB',
        to: 'TO_STUB',
        from: 'FROM_STUB',
        timeLayersFactory: timeLayersFactory
      };
      loader = new AnimationLayerLoader(baseLayer, options);
    });

    function resolveLoadDependencies(opt_times) {
      var times = opt_times || new MockTimes();
      baseLayer.resolveTileTimes(times);
      _.invoke(timeLayersFactory.getStubbedLayers(), 'markAsLoaded');
    }


    describe('load', function() {

      it('should return a promise', function() {
        expect(loader.load()).toBeInstanceOf(Promise);
      });

      it('should only resolve when all layers have loaded', function() {
        var layers;
        var promiseToLoad = loader.load();

        baseLayer.resolveTileTimes(new MockTimes());

        layers = timeLayersFactory.getStubbedLayers();
        _.each(layers, function(layer) {
          expect(promiseToLoad.getState()).not.toEqual('resolved');
          layer.markAsLoaded();
        });

        expect(promiseToLoad.getState()).toEqual('resolved');
      });

      it('should resolve with TimeLayerFactory-generated layers', function() {
        var onDone = jasmine.createSpy('onDone');

        loader.load().done(onDone);
        resolveLoadDependencies();

        expect(onDone).toHaveBeenCalledWith(timeLayersFactory.getStubbedLayers());
      });

      it('should reject if tile times fail to load', function() {
        var onFail = jasmine.createSpy('onFail');
        var tileTimesError = new Error('TILE_TIMES_ERROR');

        loader.load().fail(onFail);
        baseLayer.rejectTileTimes(tileTimesError);

        expect(onFail).toHaveBeenCalledWith(tileTimesError);
      });


      describe('\'load:*\' events', function() {

        it('should trigger \'load:progress\' events when a individual layer is loaded', function() {
          var layers;
          var TIMES_COUNT = 10;
          var onLoadProgress = jasmine.createSpy('onLoadProgress');
          loader.load();
          loader.on('load:progress', onLoadProgress);

          baseLayer.resolveTileTimes(new MockTimes(TIMES_COUNT));

          layers = _.values(timeLayersFactory.getStubbedLayers());
          _.each(layers, function(layer, i) {
            var progress = (i + 1) / TIMES_COUNT;
            layer.markAsLoaded();

            expect(onLoadProgress).toHaveBeenCalledWith(progress);
          });
        });

        it('should trigger a \'load:complete\' event when all layers are loaded', function() {
          var onLoadComplete = jasmine.createSpy('onLoadComplete');
          loader.on('load:complete', onLoadComplete);

          loader.load();
          resolveLoadDependencies();

          expect(onLoadComplete).toHaveBeenCalledWith(1);
        });

        it('should trigger a \'load:progress\' event when any layer fires a \'load:reset\' event', function() {
          var onLoadProgress = jasmine.createSpy('onLoadProgress');
          loader.load();
          loader.on('load:progress', onLoadProgress);

          resolveLoadDependencies();

          _.values(timeLayersFactory.getStubbedLayers())[0].trigger('load:reset');

          expect(onLoadProgress).toHaveBeenCalled();
        });

        it('should trigger a \'load:error\' event if the tile times fail to load', function() {
          var onLoadError = jasmine.createSpy('onLoadError');
          var tileTimesError = new Error('TIlE_TIMES_ERROR');
          loader.load();
          loader.on('load:error', onLoadError);

          baseLayer.rejectTileTimes(tileTimesError);

          expect(onLoadError).toHaveBeenCalledWith(tileTimesError);
        });

      });

    });


    describe('getLoadProgress', function() {
      var layers;

      it('should return 0 if times have not yet been loaded', function() {
        expect(loader.getLoadProgress()).toEqual(0);
      });

      it('should return the percentage of layers loaded', function() {
        var layers;

        loader.load();
        baseLayer.resolveTileTimes([10, 20, 30, 40]);
        layers = timeLayersFactory.getStubbedLayers();

        layers[10].markAsLoaded();
        layers[30].markAsLoaded();

        expect(loader.getLoadProgress()).toEqual(0.5);
      });


      it('should return 1 if all layers are loaded', function() {
        loader.load();
        resolveLoadDependencies();

        _.invoke(timeLayersFactory.getStubbedLayers(), 'markAsLoaded');

        expect(loader.getLoadProgress()).toEqual(1);
      });

    });

  });

});
