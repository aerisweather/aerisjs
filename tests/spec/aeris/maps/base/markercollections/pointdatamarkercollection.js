define([
  'aeris/util',
  'aeris/events',
  'aeris/model',
  'sinon',
  'base/markercollections/pointdatamarkercollection',
  'aeris/collection',
  'api/endpoint/collection/pointdatacollection',
  'api/params/model/params'
], function(_, Events, Model, sinon, MarkerCollection, Collection, PointDataCollection, Params) {
  var TestFactory = function(opt_options) {
    var options = _.extend({
      data: new MockData(),
      map: undefined,
      strategy: null
    }, opt_options);

    this.markers = new MarkerCollection(null, _.pick(options, [
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


  var MockData = function() {
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
  _.inherits(MockData, PointDataCollection);


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


  describe('A PointDataMarkerCollection', function() {

    describe('constructor', function() {

      it('should require a valid data collection', function() {
        expect(function() {
          new MarkerCollection({
            data: 'foo'
          });
        }).toThrowType('InvalidArgumentError');
      });

    });

    describe('PointDataCollection Events', function() {
      it('should add a marker when data is added', function() {
        var test = new TestFactory({
          url: 'someUrl'
        });
        var latLon = [45.123, -90.123];
        var dataModel = new Model({
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
        var dataModel = new Model();
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
          var model = new Model({
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

      it('should fetch data when a map is set', function() {
        var test = new TestFactory();
        test.markers.setMap(new MockMap());

        expect(test.data.fetch).toHaveBeenCalled();
      });

      it('should fetch data only once', function() {
        var test = new TestFactory();
        test.markers.setMap(new MockMap());

        expect(test.data.fetch.callCount).toEqual(1);
      });

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

        it('should re-fetch data when map bounds change', function() {
          var test = new TestFactory();
          var map = new MockMap();
          var initFetchCount;

          test.markers.setMap(map);
          initFetchCount = test.data.fetch.callCount;

          map.trigger('change:bounds');
          expect(test.data.fetch.callCount).toEqual(initFetchCount + 1);
        });

      });

    });

    describe('remove', function() {

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

    });

  });
});
