define([
  'aeris/util',
  'sinon',
  'aeris/maps/strategy/markers/markercluster',
  'aeris/collection',
  'aeris/model',
  'aeris/promise',
  'tests/lib/clock'
], function(_, sinon, MarkerClusterStrategy, Collection, Model, Promise, clock) {
  var ASYNC_DELAY = 100;

  var MockMarkerClustererFactory = function() {
    var MockMarkerClusterer = jasmine.createSpy('MarkerClusterer ctor');
    MockMarkerClusterer.prototype.addMarker = jasmine.createSpy('MarkerClusterer#addMarker');
    MockMarkerClusterer.prototype.setMap = jasmine.createSpy('MarkerClusterer#setMap');
    MockMarkerClusterer.prototype.clearMarkers = jasmine.createSpy('MarkerClusterer#clearMarkers');
    MockMarkerClusterer.prototype.getMarkers = jasmine.createSpy('MarkerClusterer#getMarkers').andReturn([]);

    return MockMarkerClusterer;
  };


  var MockMarker = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      type: undefined
    });

    var markerView = _.uniqueId('MarkerView_');

    this.getType = jasmine.createSpy('Marker#getType').andReturn(options.type);

    this.getView = jasmine.createSpy('Marker#getView').
      andReturn(markerView);

    this.requestView = jasmine.createSpy('Marker#requestView').
      andCallFake(function() {
        var promise = new Promise();

        _.delay(promise.resolve.bind(promise), ASYNC_DELAY, markerView);

        return promise;
      });

    Model.apply(this, arguments);
  };
  _.inherits(MockMarker, Model);


  var MockMarkerCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      map: new MockMap(),
      model: MockMarker
    });

    this.hasMap = jasmine.createSpy('hasMap').
      andReturn(!!options.map);

    this.getMap = jasmine.createSpy('getMap').
      andReturn(options.map);

    // Cans to return { icon: 'GROUPNAME_ICON' }
    this.getClusterStyle = jasmine.createSpy('getClusterStyle').
      andCallFake(function(groupName) {
        groupName || (groupName = 'SINGLE');
        return { url: groupName.toUpperCase() + '_ICON' };
      });

    this.getClusterOptions = jasmine.createSpy('getClusterOptions').andReturn({});

    Collection.call(this, opt_models, options);
  };
  _.inherits(MockMarkerCollection, Collection);


  var MockMap = function() {
    this.getView = jasmine.createSpy('Map#getView').
      andReturn(_.uniqueId('MapView_'));

    Model.apply(this, arguments);
  };
  _.inherits(MockMap, Model);


  beforeEach(function() {
    clock.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });


  describe('A MarkerClustererStrategy', function() {

    describe('constructor', function() {

      describe('createView', function() {

        it('should add all of the object\'s markers', function() {
          var obj = new MockMarkerCollection([
            { data: { report: { type: 'rain' } } },
            { data: { report: { type: 'snow' } } },
            { data: { report: { type: 'rain' } } },
            { data: { report: { type: 'fog' } } }
          ]);

          spyOn(MarkerClusterStrategy.prototype, 'addMarkers');

          new MarkerClusterStrategy(obj, { MarkerClusterer: MockMarkerClustererFactory() });

          expect(MarkerClusterStrategy.prototype.addMarkers).toHaveBeenCalledWith(obj.models);
        });

        it('should pass on clusterOptions from the marker object', function() {
          var clustererCtorOptions;
          var markerCollection = new MockMarkerCollection([new MockMarker()]);
          var MockMarkerClusterer = MockMarkerClustererFactory();
          markerCollection.getClusterOptions.andReturn({
            foo: 'bar'
          });

          new MarkerClusterStrategy(markerCollection, {
            MarkerClusterer: MockMarkerClusterer
          });

          clustererCtorOptions = MockMarkerClusterer.mostRecentCall.args[2];
          expect(clustererCtorOptions.foo).toEqual('bar');
        });

      });


      describe('Event binding', function() {
        var obj, strategy;

        beforeEach(function() {
          obj = new MockMarkerCollection();
          strategy = new MarkerClusterStrategy(obj, {
            MarkerClusterer: MockMarkerClustererFactory()
          });
        });

        it('should add a marker added to the object', function() {
          var marker = new MockMarker();

          spyOn(strategy, 'addMarker');

          obj.trigger('add', marker, obj, { some: 'opts' });
          expect(strategy.addMarker).toHaveBeenCalledWith(marker);
        });

        it('should reset clusters when a marker is removed from the object', function() {
          var marker = new MockMarker();
          spyOn(strategy, 'resetClusters');

          obj.trigger('remove', marker, obj, { some: 'opts' });

          // Required, because event handler is debounced
          clock.tick(500);

          expect(strategy.resetClusters).toHaveBeenCalled();
        });

        it('should only reset clusters once, if several markers are removed within 500 ms', function() {
          spyOn(strategy, 'resetClusters');

          obj.trigger('remove', new MockMarker(), obj);
          obj.trigger('remove', new MockMarker(), obj);
          obj.trigger('remove', new MockMarker(), obj);

          clock.tick(500);
          expect(strategy.resetClusters.callCount).toEqual(1);


          obj.trigger('remove', new MockMarker(), obj);
          obj.trigger('remove', new MockMarker(), obj);
          obj.trigger('remove', new MockMarker(), obj);

          clock.tick(500);
          expect(strategy.resetClusters.callCount).toEqual(2);


          obj.trigger('remove', new MockMarker(), obj);
          obj.trigger('remove', new MockMarker(), obj);
          obj.trigger('remove', new MockMarker(), obj);
          clock.tick(500);
          expect(strategy.resetClusters.callCount).toEqual(3);

          clock.tick(500);
          expect(strategy.resetClusters.callCount).toEqual(3);
        });

        it('should reset the MarkerClusterers, if the object is reset', function() {
          spyOn(strategy, 'resetClusters');

          obj.trigger('reset', obj, { some: 'opts' });

          // Required, because event handler is debounced
          clock.tick(500);

          expect(strategy.resetClusters).toHaveBeenCalled();
        });

        it('should repaint clusters when marker properties change', function() {
          spyOn(strategy, 'repaint');

          obj.trigger('change', new MockMarker(), { some: 'opts' });


          // Required, because event handler is debounced
          clock.tick(500);

          expect(strategy.repaint).toHaveBeenCalled();
        });

        // Not sure how to test these...
        /*it('should trigger a click event on the object when a marker cluster is clicked', function() {
         });

         it('should trigger a mouseover event on the object when a markercluster is mouse-over\'d', function() {
         });

         it('should trigger a mouseout event on the object when a markercluster is mouse-out\'d', function() {
         });*/

      });

    });

    describe('addMarker', function() {

      it('should add the marker to its group\'s clusterer, creating a new clusterer if necessary', function() {
        var obj = new MockMarkerCollection();
        var MarkerClusterer = MockMarkerClustererFactory();
        var markers = [
          new MockMarker(undefined, { type: 'snow' }),
          new MockMarker(undefined, { type: 'snow' }),
          new MockMarker(undefined, { type: 'rain' })
        ];
        var strategy = new MarkerClusterStrategy(obj, { MarkerClusterer: MarkerClusterer });

        // Add a marker with a new group
        // --> Create a MarkerClusterer for the group
        strategy.addMarker(markers[0]);
        clock.tick(ASYNC_DELAY);
        expect(strategy.getView().snow).toBeInstanceOf(MarkerClusterer);
        expect(MarkerClusterer.prototype.addMarker).toHaveBeenCalledWith(markers[0].getView());

        // Add another of the same type
        // --> Should NOT create another MarkerClusterer instance
        strategy.addMarker(markers[1]);
        clock.tick(ASYNC_DELAY);
        expect(MarkerClusterer.callCount).toEqual(1);
        expect(MarkerClusterer.prototype.addMarker).toHaveBeenCalledWith(markers[1].getView());
        expect(strategy.getView().snow).toBeInstanceOf(MarkerClusterer);

        // Add another of a different type
        // --> Should create another MarkerClusterer instance
        strategy.addMarker(markers[2]);
        clock.tick(ASYNC_DELAY);
        expect(MarkerClusterer.callCount).toEqual(2);
        expect(MarkerClusterer.prototype.addMarker).toHaveBeenCalledWith(markers[2].getView());
        expect(strategy.getView().rain).toBeInstanceOf(MarkerClusterer);
        expect(strategy.getView().snow).toBeInstanceOf(MarkerClusterer);
      });

      it('should group together markers which do not define a type', function() {
        var newMarker;
        var obj = new MockMarkerCollection();
        var MarkerClusterer = MockMarkerClustererFactory();
        var markers = [
          new MockMarker(undefined, { type: 'snow' }),
          new MockMarker(undefined, { type: 'snow' }),
          new MockMarker(undefined, { type: 'rain' }),
          new MockMarker(),
          new MockMarker(),
          new MockMarker()
        ];
        var strategy = new MarkerClusterStrategy(obj, {
          MarkerClusterer: MarkerClusterer
        });
        var singleClusterer;

        // Add markers
        _.each(markers, strategy.addMarker, strategy);
        clock.tick(ASYNC_DELAY * markers.length);

        // Created 3 clusters: 'snow', 'rain', none-of-the-above (singleClusterer);
        expect(_(strategy.getView()).keys().length).toEqual(3);
        singleClusterer = strategy.getView()[MarkerClusterStrategy.SINGLE_CLUSTER_GROUPNAME];
        expect(singleClusterer).toBeDefined();

        singleClusterer.addMarker = jasmine.createSpy('SINGLE#addMarker');

        // Add another non-matching marker
        // --> should be added to non-matching group
        newMarker = new MockMarker();
        strategy.addMarker(newMarker);
        clock.tick(ASYNC_DELAY);
        expect(strategy.getView()[MarkerClusterStrategy.SINGLE_CLUSTER_GROUPNAME].addMarker).
          toHaveBeenCalledWith(newMarker.getView());
      });

      it('should trigger \'clusterer:create\' \'clusterer:add\' events', function() {
        var obj = new MockMarkerCollection();
        var markers = [
          new MockMarker(undefined, { type: 'snow' }),
          new MockMarker(undefined, { type: 'snow' }),
          new MockMarker(undefined, { type: 'rain' })
        ];
        var strategy = new MarkerClusterStrategy(obj, {
          MarkerClusterer: MockMarkerClustererFactory()
        });
        var listeners = jasmine.createSpyObj('evtListener', ['add', 'create']);

        strategy.on({
          'clusterer:create': listeners.create,
          'clusterer:add': listeners.add
        });

        _.each(markers, strategy.addMarker, strategy);

        expect(listeners.create).toHaveBeenCalledWith(strategy.getClusterer('snow'));
        expect(listeners.create).toHaveBeenCalledWith(strategy.getClusterer('rain'));

        expect(listeners.add).toHaveBeenCalledWith(strategy.getClusterer('snow'), 'snow');
        expect(listeners.add).toHaveBeenCalledWith(strategy.getClusterer('rain'), 'rain');
      });

    });


    describe('setMap', function() {

      it('should set the specified map on all MarkerClusterer objects', function() {
        var obj = new MockMarkerCollection();
        var strategy = new MarkerClusterStrategy(obj, {
          MarkerClusterer: MockMarkerClustererFactory()
        });
        var newMap = new MockMap();

        strategy.addMarkers([
          new MockMarker(undefined, { type: 'snow'}),
          new MockMarker(undefined, { type: 'snow'}),
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'hail'})
        ]);

        // Spy on MarkerClusterer#setMap
        strategy.getClusterer('snow').setMap = jasmine.createSpy('setMap-snow');
        strategy.getClusterer('rain').setMap = jasmine.createSpy('setMap-rain');
        strategy.getClusterer('hail').setMap = jasmine.createSpy('setMap-hail');

        strategy.setMap(newMap);
        expect(strategy.getClusterer('snow').setMap).toHaveBeenCalledWith(newMap.getView());
        expect(strategy.getClusterer('rain').setMap).toHaveBeenCalledWith(newMap.getView());
        expect(strategy.getClusterer('hail').setMap).toHaveBeenCalledWith(newMap.getView());
      });

    });


    describe('remove', function() {

      it('should set all MarkerClusterer objects\' maps to  null', function() {
        var obj = new MockMarkerCollection();
        var strategy = new MarkerClusterStrategy(obj, {
          MarkerClusterer: MockMarkerClustererFactory()
        });

        strategy.addMarkers([
          new MockMarker(undefined, { type: 'snow'}),
          new MockMarker(undefined, { type: 'snow'}),
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'hail'})
        ]);

        // Spy on MarkerClusterer#setMap
        strategy.getClusterer('snow').setMap = jasmine.createSpy('setMap-snow');
        strategy.getClusterer('rain').setMap = jasmine.createSpy('setMap-rain');
        strategy.getClusterer('hail').setMap = jasmine.createSpy('setMap-hail');

        strategy.remove();
        expect(strategy.getClusterer('snow').setMap).toHaveBeenCalledWith(null);
        expect(strategy.getClusterer('rain').setMap).toHaveBeenCalledWith(null);
        expect(strategy.getClusterer('hail').setMap).toHaveBeenCalledWith(null);
      });

    });


    describe('addMarkers', function() {

      it('should add all the markers in the array', function() {
        var obj = new MockMarkerCollection();
        var strategy = new MarkerClusterStrategy(obj, { MarkerClusterer: MockMarkerClustererFactory() });
        var markers = ['marker_0', 'marker_1', 'marker_2'];

        spyOn(strategy, 'addMarker');

        strategy.addMarkers(markers);

        expect(strategy.addMarker.callCount).toEqual(3);
        expect(strategy.addMarker).toHaveBeenCalledInTheContextOf(strategy);
        expect(strategy.addMarker.argsForCall[0][0]).toEqual(markers[0]);
        expect(strategy.addMarker.argsForCall[1][0]).toEqual(markers[1]);
        expect(strategy.addMarker.argsForCall[2][0]).toEqual(markers[2]);
      });

    });


    describe('removeMarker', function() {
      it('should remove a marker from the matching clusterer', function() {
        var strategy = new MarkerClusterStrategy(new MockMarkerCollection(), {
          MarkerClusterer: MockMarkerClustererFactory()
        });
        var markers = [
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'snow'})
        ];

        strategy.addMarkers(markers);

        strategy.getClusterer('rain').removeMarker = jasmine.createSpy('removeRainMarker');
        strategy.getClusterer('snow').removeMarker = jasmine.createSpy('removeSnowMarker');

        strategy.removeMarker(markers[0]);
        clock.tick(ASYNC_DELAY);
        expect(strategy.getClusterer('rain').removeMarker).toHaveBeenCalledWith(markers[0].getView());

        strategy.removeMarker(markers[1]);
        clock.tick(ASYNC_DELAY);
        expect(strategy.getClusterer('rain').removeMarker).toHaveBeenCalledWith(markers[1].getView());

        strategy.removeMarker(markers[2]);
        clock.tick(ASYNC_DELAY);
        expect(strategy.getClusterer('snow').removeMarker).toHaveBeenCalledWith(markers[2].getView());
      });
    });


    describe('clearClusters', function() {
      it('should clear markers from all clusterer objects', function() {
        var strategy = new MarkerClusterStrategy(new MockMarkerCollection(), {
          MarkerClusterer: MockMarkerClustererFactory()
        });
        var markers = [
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'snow'})
        ];
        var rainClusterer, snowClusterer;

        strategy.addMarkers(markers);

        rainClusterer = strategy.getClusterer('rain');
        snowClusterer = strategy.getClusterer('snow');

        rainClusterer.clearMarkers = jasmine.createSpy('clearMarkers_rain');
        snowClusterer.clearMarkers = jasmine.createSpy('clearMarkers_snow');

        strategy.clearClusters();
        expect(rainClusterer.clearMarkers).toHaveBeenCalled();
        expect(snowClusterer.clearMarkers).toHaveBeenCalled();

        // Should clean up view object
        expect(_(strategy.getView()).keys().length).toEqual(0);
      });

      it('should trigger a \'clusterer:remove\' event for each clusterer', function() {
        var strategy = new MarkerClusterStrategy(new MockMarkerCollection(), {
          MarkerClusterer: MockMarkerClustererFactory()
        });
        var markers = [
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'snow'})
        ];
        var rainClusterer, snowClusterer;
        var removeListener = jasmine.createSpy('removeListener');

        strategy.addMarkers(markers);

        rainClusterer = strategy.getClusterer('rain');
        snowClusterer = strategy.getClusterer('snow');

        // Bind listeners (spies)
        strategy.on('clusterer:remove', removeListener);

        strategy.clearClusters();
        expect(removeListener).toHaveBeenCalledWith(rainClusterer, 'rain');
        expect(removeListener).toHaveBeenCalledWith(snowClusterer, 'snow');
      });
    });


    describe('resetClusters', function() {

      it('should remove and re-add all markers', function() {
        var obj = new MockMarkerCollection([
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'snow'}),
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'fog'})
        ]);
        var strategy = new MarkerClusterStrategy(obj, {
          MarkerClusterer: MockMarkerClustererFactory()
        });

        spyOn(strategy, 'clearClusters');
        spyOn(strategy, 'addMarkers');

        strategy.resetClusters();

        expect(strategy.clearClusters).toHaveBeenCalled();
        expect(strategy.addMarkers).toHaveBeenCalledWith(obj.models);
      });

    });


    describe('repaint', function() {

      it('should repaint all MarkerClusterer objects', function() {
        var obj = new MockMarkerCollection();
        var strategy = new MarkerClusterStrategy(obj, {
          MarkerClusterer: MockMarkerClustererFactory()
        });

        strategy.addMarkers([
          new MockMarker(undefined, { type: 'snow'}),
          new MockMarker(undefined, { type: 'snow'}),
          new MockMarker(undefined, { type: 'rain'}),
          new MockMarker(undefined, { type: 'hail'})
        ]);

        // Spy on MarkerClusterer#repaint
        strategy.getClusterer('snow').repaint = jasmine.createSpy('repaint-snow');
        strategy.getClusterer('rain').repaint = jasmine.createSpy('repaint-rain');
        strategy.getClusterer('hail').repaint = jasmine.createSpy('repaint-hail');

        strategy.repaint();
        expect(strategy.getClusterer('snow').repaint).toHaveBeenCalled();
        expect(strategy.getClusterer('rain').repaint).toHaveBeenCalled();
        expect(strategy.getClusterer('hail').repaint).toHaveBeenCalled();
      });

    });


    describe('destroy', function() {

      it('should clear clusters', function() {
        var obj = new MockMarkerCollection();
        var strategy = new MarkerClusterStrategy(obj, {
          MarkerClusterer: MockMarkerClustererFactory()
        });

        spyOn(strategy, 'clearClusters');

        strategy.destroy();
        expect(strategy.clearClusters).toHaveBeenCalled();
      });

    });

  });

});
