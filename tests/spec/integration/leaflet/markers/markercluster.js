define([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/markercollections/markercollection',
  'aeris/maps/markers/marker',
  'tests/spec/integration/helpers/mapcanvas',
  'tests/spec/integration/helpers/triggermouseevent',
  'jquery',
  'tests/lib/flag'
], function(_, Map, MarkerCollection, Marker, MapCanvas, triggerMouseEvent, $, Flag) {
  var ASYNC_DELAY = 100;

  describe('A MarkerCollection (Leaflet)', function() {
    var markerCollection, map, mapCanvas, layersReadyFlag;
    var clusterStyles;

    var NW = [45, -120], NE = [45, -80], SW = [30, -120], SE = [30, -80];
    var CLUSTER_CLASS = 'aeris-cluster';
    var MARKER_URL = 'http://cdn.aerisjs.com/assets/lightning_blue.png';
    var CLUSTER_URL = 'http://cdn.aerisjs.com/assets/poi.png';

    beforeEach(function() {
      mapCanvas = new MapCanvas();
      // To make sure we have room for markers;
      mapCanvas.style.height = '800px';

      map = new Map(mapCanvas.id);
    });
    afterEach(function() {
      mapCanvas.remove();
    });


    beforeEach(function() {
      clusterStyles = {
        url: CLUSTER_URL,
        width: 25,
        height: 25,
        textColor: 'white',
        textSize: 13,
        anchorText: [-14, 15]
      };


      markerCollection = new MarkerCollection(null, {
        clusterStyles: {
          defaultStyles: [clusterStyles]
        }
      });
    });

    beforeEach(function() {
      // Set the layersReadyFlag when layers have been added to the map
      layersReadyFlag = new Flag();

      // 25 ms seems like enough time to load all layers.
      // This might be a little dangerous....
      //  - it will slow down our tests
      //  - there's some guesswork involved.
      // However, it's the only way I can think of to make sure that
      // markers are find-able on the map when are tests are run.
      map.getView().on('layeradd', _.debounce(layersReadyFlag.set, ASYNC_DELAY));
    });

    it('should not render anything if the collection is empty', function() {
      markerCollection.setMap(map);
      markerCollection.reset();

      layersReadyFlag.then(function() {
        expect(findMarkers().length).toEqual(0);
        expect(findClusters().length).toEqual(0);
      });
    });


    describe('when many nearby markers are added to a collection', function() {
      var MARKER_COUNT;

      beforeEach(function() {
        MARKER_COUNT = 17;

        markerCollection.setMap(map);
        markerCollection.add(getMarkers(MARKER_COUNT));
      });


      it('should render a single cluster element', function() {
        layersReadyFlag.then(function() {
          expect(findClusters().length).toEqual(1);
        });
      });

      it('should not render individual markers', function() {
        layersReadyFlag.then(function() {
          expect(findMarkers().length).toEqual(0);
        });
      });

      it('should render the marker count in the cluster element', function() {
        layersReadyFlag.then(function() {
          expect(getClusterCount()).toMatch(MARKER_COUNT.toString());
        });
      });

    });

    describe('when nearby markers are added to the collection after a delay', function() {
      var delayFlag;

      beforeEach(function() {
        delayFlag = new Flag();

        _.delay(function() {
          markerCollection.add(getMarkers(10));

          delayFlag.set();
        }, ASYNC_DELAY);

        markerCollection.setMap(map);
      });


      it('should render a single cluster element', function() {
        delayFlag.then(function() {
          expect(findClusters().length).toEqual(1);
        });
      });

      it('should not render individual markers', function() {
        delayFlag.then(function() {
          expect(findMarkers().length).toEqual(0);
        });
      });


    });

    describe('when markers groups are added in two different locations', function() {
      var delayFlag;

      beforeEach(function() {
        delayFlag = new Flag();

        _.delay(function() {
          markerCollection.add(getMarkers(5, NE));
          markerCollection.add(getMarkers(5, SW));

          delayFlag.set();
        }, ASYNC_DELAY);

        markerCollection.setMap(map);
      });


      it('should render cluster elements for each marker group', function() {
        delayFlag.then(function() {
          expect(findClusters().length).toEqual(2);
        });
      });

      it('should not render individual markers', function() {
        delayFlag.then(function() {
          expect(findMarkers().length).toEqual(0);
        });
      });

    });

    describe('when markers are added in faraway locations', function() {
      var delayFlag;

      beforeEach(function() {
        delayFlag = new Flag();

        _.delay(function() {
          markerCollection.add(getMarkers(1, NE));
          markerCollection.add(getMarkers(1, NW));
          markerCollection.add(getMarkers(1, SE));
          markerCollection.add(getMarkers(1, SW));

          delayFlag.set();
        }, ASYNC_DELAY);

        markerCollection.setMap(map);
      });


      it('should not create any cluster elements', function() {
        delayFlag.then(function() {
          expect(findClusters().length).toEqual(0);
        });
      });

      it('should render marker icons for each marker', function() {
        delayFlag.then(function() {
          expect(findMarkers().length).toEqual(4);
        });
      });

    });

    describe('when a single marker is added with a type', function() {
      var TYPE_STUB = 'TYPE_STUB';

      beforeEach(function() {
        markerCollection.setMap(map);
        markerCollection.add(getMarkers(1, SW, { type: TYPE_STUB }));
      });

      it('should render the marker', function() {
        layersReadyFlag.then(function() {
          expect(findMarkers().length).toEqual(1);
        });
      });

    });

    describe('when a group of markers are added with a type', function() {
      var TYPE_STUB = 'TYPE_STUB';

      beforeEach(function() {
        markerCollection.setMap(map);
        markerCollection.add(getMarkers(5, SW, { type: TYPE_STUB }));
      });

      it('should render a cluster element', function() {
        layersReadyFlag.then(function() {
          expect(findClusters().length).toEqual(1);
        });
      });

    });

    describe('when nearby groups of markers with different types are added', function() {
      var TYPE_A_STUB = 'TYPE_A_STUB', TYPE_B_STUB = 'TYPE_B_STUB';

      beforeEach(function() {
        markerCollection.setMap(map);
        markerCollection.add(getMarkers(5, SW, { type: TYPE_A_STUB }));
        markerCollection.add(getMarkers(5, SW, { type: TYPE_B_STUB }));
      });


      it('should render a cluster element for each marker type', function() {
        layersReadyFlag.then(function() {
          expect(findClusters().length).toEqual(2);
        });
      });

    });

    describe('when a marker is removed', function() {

      beforeEach(function() {
        markerCollection.setMap(map);
      });


      it('should reduce the cluster count when a marker is removed', function() {
        markerCollection.setMap(map);

        layersReadyFlag.then(function() {
          markerCollection.add(getMarkers(10));

          markerCollection.pop();
          expect(getClusterCount()).toMatch('9');

          markerCollection.pop();
          expect(getClusterCount()).toMatch('8');
        });
      });

      it('should replace the cluster with a marker, if all but one marker is removed', function() {
        markerCollection.setMap(map);

        layersReadyFlag.then(function() {
          markerCollection.add(getMarkers(2));

          markerCollection.pop();
          expect(findClusters().length).toEqual(0);
          expect(findMarkers().length).toEqual(1);
        });
      });

    });


    describe('when the collection is reset', function() {

      beforeEach(function() {
        markerCollection.setMap(map);
      });


      describe('when no new markers are added', function() {

        it('should remove all clusters and markers', function() {
          layersReadyFlag.then(function() {
            markerCollection.reset();

            expect(findClusters().length).toEqual(0);
          });
        });

      });

      describe('when a single new marker is added', function() {

        it('should render only a single marker', function() {
          layersReadyFlag.then(function() {
            markerCollection.reset(getMarkers(1));

            expect(findClusters().length).toEqual(0);
            expect(findMarkers().length).toEqual(1);
          });
        });

      });

      describe('when several new markers are added', function() {

        it('should render a cluster', function() {
          layersReadyFlag.then(function() {
            markerCollection.reset(getMarkers(5));

            expect(findClusters().length).toEqual(1);
            expect(findMarkers().length).toEqual(0);
          });
        });

      });


      describe('adding a collection to the map', function() {
        var delayFlag;

        beforeEach(function() {
          delayFlag = new Flag();

          markerCollection.add(getMarkers(5));

          _.delay(function() {
            markerCollection.setMap(map);
            delayFlag.set();
          }, ASYNC_DELAY);
        });


        it('should render clusters elements', function() {
          delayFlag.then(function() {
            expect(findClusters().length).toBeGreaterThan(0);
          });
        });

      });

    });

    describe('removing a collection from the map', function() {
      var delayFlag;

      beforeEach(function() {
        delayFlag = new Flag();

        _.delay(function() {
          markerCollection.setMap(map);
          markerCollection.setMap(null);
          delayFlag.set();
        }, ASYNC_DELAY);
      });


      it('should remove cluster elements', function() {
        delayFlag.then(function() {
          expect(findClusters().length).toEqual(0);
        });
      });

      it('should not render individual marker elements', function() {
        delayFlag.then(function() {
          expect(findMarkers().length).toEqual(0);
        });
      });

    });


    describe('MarkerCollection events', function() {

      beforeEach(function() {
        markerCollection.setMap(map);
        markerCollection.add(getMarkers(5, NW));
        markerCollection.add(getMarkers(1, SE));
      });


      describe('click', function() {
        var onClick;

        beforeEach(function() {
          onClick = jasmine.createSpy('onClick');
          markerCollection.on('click', onClick);
        });


        it('should fire when an individual marker is clicked', function() {
          layersReadyFlag.then(function() {
            triggerMarkerEvent('click');
            expect(onClick).toHaveBeenCalled();
          });
        });

        it('should only fire once for each clicked marker', function() {
          layersReadyFlag.then(function() {
            triggerMarkerEvent('click');
            expect(onClick.callCount).toEqual(1);
          });
        });

        it('should not fire when a cluster is clicked', function() {
          layersReadyFlag.then(function() {
            triggerClusterEvent('click');
            expect(onClick).not.toHaveBeenCalled();
          });
        });

      });

      describe('cluster:click', function() {
        var onClusterClick;

        beforeEach(function() {
          onClusterClick = jasmine.createSpy('onClusterClick');
          markerCollection.on('cluster:click', onClusterClick);
        });

        it('should fire when a cluster is clicked', function() {
          layersReadyFlag.then(function() {
            triggerClusterEvent('click');
            expect(onClusterClick).toHaveBeenCalled();
          });
        });

        it('should provide an aeris LatLon object', function() {
          onClusterClick.andCallFake(function(latLon) {
            expect(_.isArray(latLon)).toEqual(true);
            expect(_.isNumeric(latLon[0])).toEqual(true);
            expect(_.isNumeric(latLon[1])).toEqual(true);
          });

          layersReadyFlag.then(function() {
            triggerClusterEvent('click');
            expect(onClusterClick).toHaveBeenCalled();
          });
        });

        it('should not fire when an individual marker is clicked', function() {
          layersReadyFlag.then(function() {
            triggerMarkerEvent('click');
            expect(onClusterClick).not.toHaveBeenCalled();
          });
        });

      });


      describe('cluster:mouseover', function() {
        var onClusterMouseOver;

        beforeEach(function() {
          onClusterMouseOver = jasmine.createSpy('onClusterMouseOver');
          markerCollection.on('cluster:mouseover', onClusterMouseOver);
        });

        it('should fire when the mouse enters a cluster element', function() {
          layersReadyFlag.then(function() {
            triggerClusterEvent('mouseover');
            expect(onClusterMouseOver).toHaveBeenCalled();
          });
        });

        it('should not fire when the mouse enters an individual marker', function() {
          layersReadyFlag.then(function() {
            triggerMarkerEvent('mouseover');
            expect(onClusterMouseOver).not.toHaveBeenCalled();
          });
        });

      });


      describe('cluster:mouseout', function() {
        var onClusterMouseOut;

        beforeEach(function() {
          onClusterMouseOut = jasmine.createSpy('onClusterMouseOut');
          markerCollection.on('cluster:mouseout', onClusterMouseOut);
        });

        it('should fire when the mouse leaves a cluster element', function() {
          layersReadyFlag.then(function() {
            triggerClusterEvent('mouseout');
            expect(onClusterMouseOut).toHaveBeenCalled();
          });
        });

        it('should not fire when the mouse leaves an individual marker', function() {
          layersReadyFlag.then(function() {
            triggerMarkerEvent('mouseout');
            expect(onClusterMouseOut).not.toHaveBeenCalled();
          });
        });

      });


    });


    function getClusterCount() {
      return findClusters().text().
        match(/\b[0-9]+\b/g)[0];
    }

    function triggerClusterEvent(event) {
      var $clusters = findClusters();

      if (!$clusters.length) {
        throw new Error('Unable to trigger cluster event: no clusters are rendered');
      }

      triggerMouseEvent($clusters[0], event);
    }

    function triggerMarkerEvent(event) {
      var $markers = findMarkers();

      if (!$markers.length) {
        throw new Error('Unable to trigger marker event: no markers are rendered');
      }

      triggerMouseEvent($markers[0], event);
    }


    function findClusters() {
      return $('.' + CLUSTER_CLASS);
    }

    function findMarkers() {
      var selector = 'img[src$="{markerUrl}"]'.
        replace('{markerUrl}', MARKER_URL);

      return $(selector);
    }


    function getMarkers(count, opt_basePos, opt_options) {
      var options = opt_options || {};
      var positions = [];
      var basePos = opt_basePos || NW;

      _.times(count, function(i) {
        var offsetX = Math.random() > 0.5 ? Math.random() : Math.random() * -1;
        var offsetY = Math.random() > 0.5 ? Math.random() : Math.random() * -1;

        positions.push([basePos[0] + offsetX, basePos[1] + offsetY]);
      });

      return positions.map(function(pos) {
        var marker = new Marker({
          position: pos,
          url: MARKER_URL
        });

        if (options.type) {
          marker.getType = _.constant(options.type);
        }

        return marker;
      });
    }

  });

});
