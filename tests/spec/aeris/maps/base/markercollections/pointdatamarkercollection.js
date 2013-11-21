define([
  'aeris/util',
  'aeris/events',
  'aeris/model',
  'aeris/promise',
  'sinon',
  'base/markercollections/pointdatamarkercollection',
  'aeris/collection',
  'api/endpoint/model/pointdata',
  'api/endpoint/collection/pointdatacollection',
  'api/params/model/params'
], function(_, Events, Model, Promise, sinon, PointDataMarkerCollection, Collection, PointData, PointDataCollection, Params) {
  var TestFactory = function(opt_options) {
    var options = _.extend({
      data: new MockDataCollection(),
      map: undefined,
      strategy: null
    }, opt_options);

    this.markers = new PointDataMarkerCollection(null, _.pick(options, [
      'marker',
      'url',
      'data',
      'strategy'
    ]));

    this.data = options.data;

    this.options = options;

    this.map = options.map;

    if (this.map) {
      spyOn(this.markers, 'getMap').andReturn(options.map);
      spyOn(this.markers, 'hasMap').andReturn(true);
    }
  };

  var MockMap = function() {
    Events.call(this);
    _.extend(this, Events.prototype);
  };
  MockMap.prototype = sinon.createStubInstance(Model);


  var MockDataCollection = function() {
    var params = new MockParams();

    // Run a standard Collection,
    // so we can take advantage of the Collection object
    // but not deal with so much side-effect
    Collection.call(this);

    this.fetch = jasmine.createSpy('data#fetch');

    this.getParams = jasmine.createSpy('data#getParams').andReturn(params);
  };
  // Inherit from PointDataCollection
  // to pass instanceof checks.
  _.inherits(MockDataCollection, PointDataCollection);


  var MockDataModel = function() {
    Model.apply(this, arguments);
  };
  _.inherits(MockDataModel, PointData);



  var MockParams = function() {
    Model.call(this);
    Events.call(this);

    _.extend(this, Events.prototype);

    spyOn(this, 'setBounds');
  };
  MockParams.prototype = sinon.createStubInstance(Params);


  var MockMarker = function() {
    Model.call(this);

    _.extend(this, jasmine.createSpyObj('MockMarker', [
      'setMap',
      'remove'
    ]));
  };
  _.inherits(MockMarker, Model);


  /**
   * Returns an array of {MockMarker} objects.
   * @param {number=} opt_count
   * @return {Array.<MockMarker>}
   */
  function getMockMarkers(opt_count) {
    var markers = [];
    var count = opt_count || 3;

    _.times(count, function() {
      markers.push(new MockMarker());
    });

    return markers;
  }


  beforeEach(function() {
    // Stub out mixed-in methods
    _.each([
      'loadStrategy',
      'setStrategy',
      'removeStrategy'
    ], function(method) {
      spyOn(PointDataMarkerCollection.prototype, method);
    });

    PointDataMarkerCollection.prototype.loadStrategy.andCallFake(function() {
      return new Promise();
    });
  });


  describe('A PointDataMarkerCollection', function() {

    describe('constructor', function() {

      beforeEach(function() {
        // Stub out methods called in constructor
        _.each([
          'startClustering',
          'listenTo'
        ], function(method) {
          spyOn(PointDataMarkerCollection.prototype, method);
        });
      });

      it('should require a valid data collection', function() {
        expect(function() {
          new PointDataMarkerCollection({
            data: 'foo'
          });
        }).toThrowType('InvalidArgumentError');
      });


      it('should set specified cluster styles', function() {
        var styles = {
          fooStyle: [
            { url: 'bar1.png', width: 10, height: 10 },
            { url: 'bar2.png', width: 20, height: 20 }
          ],
          fazStyle: [
            { url: 'baz1.png', width: 10, height: 10 },
            { url: 'baz2.png', width: 20, height: 20 }
          ]
        };
        var markers = new PointDataMarkerCollection(undefined, {
          clusterStyles: styles,
          data: new MockDataCollection()
        });

        expect(markers.getClusterStyle('fooStyle')).toEqual(styles.fooStyle);
        expect(markers.getClusterStyle('fazStyle')).toEqual(styles.fazStyle);
      });


      it('should set default cluster styles, if no styles are specified', function() {
        var markers = new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection()
        });

        expect(markers.getClusterStyle()).toBeDefined();
        _.each(markers.getClusterStyle(), function(style) {
          expect(style.url).toBeDefined();
          expect(style.height).toBeDefined();
          expect(style.width).toBeDefined();
        });
      });

      it('should set default cluster styles, if non-default styles are specified', function() {
        var styles = {
          fooStyle: [
            { url: 'bar1.png', width: 10, height: 10 },
            { url: 'bar2.png', width: 20, height: 20 }
          ],
          fazStyle: [
            { url: 'baz1.png', width: 10, height: 10 },
            { url: 'baz2.png', width: 20, height: 20 }
          ]
        };
        var markers = new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection(),
          clusterStyles: styles
        });

        expect(markers.getClusterStyle()).toBeDefined();
        _.each(markers.getClusterStyle(), function(style) {
          expect(style.url).toBeDefined();
          expect(style.height).toBeDefined();
          expect(style.width).toBeDefined();
        });
      });

      it('should turn on clustering by default', function() {
        new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection()
        });

        expect(PointDataMarkerCollection.prototype.startClustering).toHaveBeenCalled();
      });

      it('should turn on clustering if clustering option is set to true', function() {
        new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection()
        });

        expect(PointDataMarkerCollection.prototype.startClustering).toHaveBeenCalled();
      });

      it('should not turn on clustering if clustering option is set to false', function() {
        new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection(),
          cluster: false
        });

        expect(PointDataMarkerCollection.prototype.startClustering).not.toHaveBeenCalled();
      });

    });

    describe('PointDataCollection Events', function() {
      it('should add a marker when data is added', function() {
        var test = new TestFactory({
          url: 'someUrl'
        });
        var latLon = [45.123, -90.123];
        var dataModel = new MockDataModel({
          latLon: latLon
        });

        spyOn(test.markers, 'add').andCallFake(function(model) {
          expect(model.get('position')).toEqual(latLon);
          expect(model.get('url')).toEqual(test.options.url);
        });

        test.data.trigger('add', dataModel);
        expect(test.markers.add).toHaveBeenCalled();
      });

      it('should remove a marker when data is removed', function() {
        var test = new TestFactory();
        var dataModel = new MockDataModel();
        var marker;

        spyOn(test.markers, 'remove');

        // Grab the added marker
        spyOn(test.markers, 'add').andCallFake(function(m) {
          marker = m;

          // And call through
          PointDataCollection.prototype.add.apply(this, arguments);
        });
        test.data.trigger('add', dataModel);

        // Check that we remove the same marker we added
        test.data.trigger('remove', dataModel);
        expect(test.markers.remove).toHaveBeenCalledWith(marker);
      });

      it('should reset its markers when data is reset', function() {
        var test = new TestFactory();
        var models = [];
        var expectedPositions = [];

        // Create 3 models
        _.times(3, function() {
          var latLon = [Math.random() * 100, Math.random() * 100];
          var model = new MockDataModel({
            latLon: latLon
          });

          expectedPositions.push(latLon);
          models.push(model);
        });

        // Check for matching markers
        // by comparing their positions
        spyOn(test.markers, 'reset').andCallFake(function(markers) {
          _.each(markers, function(marker, n) {
            expect(marker.get('position')).toEqual(expectedPositions[n]);
          });
        });

        test.data.reset(models);
        expect(test.markers.reset).toHaveBeenCalled();
      });
    });

    describe('Its own events', function() {

      it('should add a marker to its map', function() {
        var test = new TestFactory({
          map: 'map'
        });
        var marker = new MockMarker();

        test.markers.add(marker);
        expect(marker.setMap).toHaveBeenCalledWith(test.map);
      });

      it('should remove a marker to its map', function() {
        var test = new TestFactory({
          map: 'map'
        });
        var marker = new MockMarker();

        test.markers.trigger('remove', marker);
        expect(marker.setMap).toHaveBeenCalledWith(null);
      });

      it('should reset markers on the map', function() {
        var test = new TestFactory({
          map: 'map'
        });
        var oldMarkers = [];
        var newMarkers = [];

        // Generate markers
        _.times(3, function() {
          oldMarkers.push(new MockMarker());
          newMarkers.push(new MockMarker());
        });

        test.markers.add(oldMarkers);

        test.markers.reset(newMarkers);

        // Old markers are removed from the map
        _.each(oldMarkers, function(marker) {
          expect(marker.setMap).toHaveBeenCalledWith(null);
        });

        // New markers are added to the map
        _.each(newMarkers, function(marker) {
          expect(marker.setMap).toHaveBeenCalledWith(test.map);
        });
      });

    });

    describe('setMap', function() {

      it('should set all markers to the map', function() {
        var test = new TestFactory();
        var markers = getMockMarkers();
        var map = new MockMap();
        test.markers.add(markers);

        test.markers.setMap(map);

        // All markers should be set to the map
        _.each(markers, function(marker) {
          expect(marker.setMap).toHaveBeenCalledWith(map);
        });
      });

      it('should cause any new markers to be set to the map', function() {
        var test = new TestFactory();
        var marker = new MockMarker();
        var map = new MockMap();

        test.markers.setMap(map);

        test.markers.add(marker);
        expect(marker.setMap).toHaveBeenCalledWith(map);
      });

      it('should trigger a \'map:set\' event', function() {
        var markers = new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection()
        });
        var map = new MockMap();
        var evtListener = jasmine.createSpy('evtListener');

        markers.on('map:set', evtListener);

        markers.setMap(map);
        expect(evtListener).toHaveBeenCalledWith(markers, map, {});

        // Should only be called once
        expect(evtListener.callCount).toEqual(1);

        // Should not be called redundantly
        markers.setMap(map);
        expect(evtListener.callCount).toEqual(1);
      });

      describe('map events', function() {

        it('should bind bounds parameter to map bounds', function() {
          var test = new TestFactory();
          var map = new MockMap();
          var bounds = [20, -160, 80, -55];

          spyOn(map, 'get').andCallFake(function(prop) {
            if (prop === 'bounds') {
              return bounds;
            }
            // Revert to original mock method
            return MockMap.prototype.get.apply(map, arguments);
          });

          test.markers.setMap(map);

          // Should set initial bounds
          expect(test.data.getParams().setBounds).toHaveBeenCalledWith(bounds);

          // Should sync changes
          bounds = [15, -120, 35, -52];
          map.trigger('change:bounds', map, bounds);
          expect(test.data.getParams().setBounds).toHaveBeenCalledWith(bounds);
        });

      });

    });

    describe('removeMap', function() {

      it('should remove all markers from the map', function() {
        var test = new TestFactory();
        var markers = getMockMarkers();

        test.markers.add(markers);
        test.markers.removeMap();

        _.each(markers, function(marker) {
          expect(marker.setMap).toHaveBeenCalledWith(null);
        });
      });

      it('should cause new markers not to be added to a map', function() {
        var test = new TestFactory();
        var marker = new MockMarker();

        test.markers.setMap(null);

        test.markers.add(marker);
        expect(marker.setMap).not.toHaveBeenCalled();
      });

      it('should trigger a \'map:remove\' event', function() {
        var markers = new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection()
        });
        var evtListener = jasmine.createSpy('evtListener');

        markers.on('map:remove', evtListener);

        markers.removeMap();
        expect(evtListener).toHaveBeenCalledWith(markers, null, {});

        // Should only be called once
        expect(evtListener.callCount).toEqual(1);
      });

    });


    describe('startClustering', function() {

      it('should load the cluster strategy (clusterStrategy is string)', function() {
        var markers = new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection(),
          clusterStrategy: 'some/strategy',
          cluster: false
        });

        markers.startClustering();
        expect(markers.loadStrategy).toHaveBeenCalledWith('some/strategy');
      });

      it('should set the cluster strategy (clusterStrategy is ctor)', function() {
        var MockStrategy = jasmine.createSpy('clusterStrategy#ctor');
        var markers = new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection(),
          clusterStrategy: MockStrategy,
          cluster: false
        });

        markers.startClustering();
        expect(markers.setStrategy).toHaveBeenCalledWith(MockStrategy);
      });

    });


    describe('stopClustering', function() {

      it('should do nothing if clustering hasn\'t been started', function() {
        var markers = new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection(),
          cluster: false
        });

        markers.stopClustering();
        expect(markers.removeStrategy).not.toHaveBeenCalled();
      });

      it('should destroy it\'s strategy', function() {
        var markers = new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection(),
          cluster: false
        });

        markers.startClustering();

        markers.stopClustering();
        expect(markers.removeStrategy).toHaveBeenCalled();
      });

    });


  });
});
