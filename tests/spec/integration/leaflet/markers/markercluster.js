define([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/markercollections/markercollection',
  'aeris/maps/markers/marker',
  'tests/spec/integration/helpers/mapcanvas',
  'tests/spec/integration/helpers/triggermouseevent',
  'tests/spec/integration/helpers/getmarkers',
  'jquery',
  'tests/lib/flag'
], function(_, Map, MarkerCollection, Marker, MapCanvas, triggerMouseEvent, getMarkers, $, Flag) {
  var ASYNC_DELAY = 100;

  describe('A MarkerCollection (Leaflet)', function() {
    var markerCollection, map, mapCanvas, layersReadyFlag;
    var clusterStyles;

    var NW = [45, -120], NE = [45, -80], SW = [30, -120], SE = [30, -80];
    var CLUSTER_CLASS = 'aeris-cluster';
    var MARKER_URL = 'http://cdn.aerisjs.com/assets/lightning_blue.png';
    var CLUSTER_URL = 'http://cdn.aerisjs.com/assets/poi.png';



    var getMarkers_orig = getMarkers;
    getMarkers = function(count, opt_position, opt_options) {
      var options = _.defaults(opt_options || {}, {
        url: MARKER_URL
      });

      return getMarkers_orig.call(this, count, opt_position, options);
    };

    beforeEach(function() {
      mapCanvas = new MapCanvas();
      // To make sure we have room for markers;
      mapCanvas.style.height = '800px';

      map = new Map(mapCanvas.id);
      map.jasmineToString = _.constant('Map');
    });
    afterEach(function() {
      mapCanvas.remove();
    });


    // toHaveMarkerCount
    beforeEach(function() {
      this.addMatchers({
        toHaveMarkerCount: function(count) {
          var map = this.actual;

          return findMarkers(map).length === count;
        },
        toHaveClusterCount: function(count) {
          var map = this.actual;

          return findClusters(map).length === count;
        }
      })
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
        expect(map).toHaveMarkerCount(0);
        expect(map).toHaveClusterCount(0);
      });
    });

    it('should render clusters for markers in the collection', function() {
      markerCollection = new MarkerCollection(getMarkers(10), {
        clusterStyles: {
          defaultStyles: [clusterStyles]
        }
      });
      markerCollection.setMap(map);

      layersReadyFlag.then(function() {
        expect(map).toHaveMarkerCount(0);
        expect(map).toHaveClusterCount(1);
      });
    });

    it('should render non-clustered markers in the collection', function() {
      var markers = getMarkers(1, NE).concat(getMarkers(1, SE));
      markerCollection = new MarkerCollection(markers, {
        clusterStyles: {
          defaultStyles: [clusterStyles]
        }
      });

      markerCollection.setMap(map);

      layersReadyFlag.then(function() {
        expect(map).toHaveMarkerCount(2);
        expect(map).toHaveClusterCount(0);
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
          expect(map).toHaveClusterCount(1);
        });
      });

      it('should not render individual markers', function() {
        layersReadyFlag.then(function() {
          expect(map).toHaveMarkerCount(0);
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
          expect(map).toHaveClusterCount(1);
        });
      });

      it('should not render individual markers', function() {
        delayFlag.then(function() {
          expect(map).toHaveMarkerCount(0);
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
          expect(map).toHaveClusterCount(2);
        });
      });

      it('should not render individual markers', function() {
        delayFlag.then(function() {
          expect(map).toHaveMarkerCount(0);
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
          expect(map).toHaveClusterCount(0);
        });
      });

      it('should render marker icons for each marker', function() {
        delayFlag.then(function() {
          expect(map).toHaveMarkerCount(4);
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
          expect(map).toHaveMarkerCount(1);
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
          expect(map).toHaveClusterCount(1);
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
          expect(map).toHaveClusterCount(2);
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
          expect(map).toHaveClusterCount(0);
          expect(map).toHaveMarkerCount(1);
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

            expect(map).toHaveClusterCount(0);
          });
        });

      });

      describe('when a single new marker is added', function() {

        it('should render only a single marker', function() {
          layersReadyFlag.then(function() {
            markerCollection.reset(getMarkers(1));

            expect(map).toHaveClusterCount(0);
            expect(map).toHaveMarkerCount(1);
          });
        });

      });

      describe('when several new markers are added', function() {

        it('should render a cluster', function() {
          layersReadyFlag.then(function() {
            markerCollection.reset(getMarkers(5));

            expect(map).toHaveClusterCount(1);
            expect(map).toHaveMarkerCount(0);
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
          expect(map).toHaveClusterCount(0);
        });
      });

      it('should not render individual marker elements', function() {
        delayFlag.then(function() {
          expect(map).toHaveMarkerCount(0);
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


    describe('toggling clustering behavior', function() {

      describe('using the `cluster: false` option', function() {

        it('should prevent markers from clustering (on init)', function() {
          var MARKER_COUNT = 10;
          var markersInSameArea = getMarkers(MARKER_COUNT, NE);
          var markerCollection = new MarkerCollection(markersInSameArea, {
            cluster: false
          });
          markerCollection.setMap(map);

          layersReadyFlag.then(function() {
            expect(map).toHaveClusterCount(0);
            expect(findMarkers().length).toEqual(MARKER_COUNT);
          });
        });

        it('should prevent markers from clustering (on init)', function() {
          var MARKER_COUNT = 10;
          var markersInSameArea = getMarkers(MARKER_COUNT, NE);
          var markerCollection = new MarkerCollection([], {
            cluster: false
          });
          markerCollection.setMap(map);

          markerCollection.add(markersInSameArea);

          layersReadyFlag.then(function() {
            expect(map).toHaveClusterCount(0);
            expect(findMarkers().length).toEqual(MARKER_COUNT);
          });
        });

      });


      describe('stopClustering', function() {
        var ctx, MARKER_COUNT_INIT = 10;

        beforeEach(function() {
          ctx = {};
        });

        describe('when using the `cluster: true` option', function() {

          beforeEach(function() {
            ctx.markerCollection = new MarkerCollection(getMarkers(MARKER_COUNT_INIT), {
              cluster: true
            });
            ctx.markerCollection.setMap(map);
          });


          itShouldStopClustering();

          describe('toggling with #startClustering', function() {

            beforeEach(function() {
              ctx.markerCollection.stopClustering();
              ctx.markerCollection.startClustering();
            });

            itShouldStopClustering();

          });


          function itShouldStopClustering() {

            it('should replace all rendered clusters with individual markers', function() {
              ctx.markerCollection.stopClustering();

              expect(map).toHaveClusterCount(0);
              expect(map).toHaveMarkerCount(MARKER_COUNT_INIT)
            });

            it('should render any new markers individually', function() {
              ctx.markerCollection.stopClustering();

              ctx.markerCollection.add(getMarkers(10, NE));
              ctx.markerCollection.add(getMarkers(10, SW));

              expect(map).toHaveClusterCount(0);
              expect(map).toHaveMarkerCount(MARKER_COUNT_INIT + 10 + 10)
            });

          }

        });

      });


      describe('startClustering', function() {
        var ctx, MARKER_COUNT_INIT = 10, CLUSTER_POSITION_INIT = NE;

        beforeEach(function() {
          ctx = {};
        });

        describe('when used with the `cluster: false` option', function() {

          beforeEach(function() {
            var markers = getMarkers(MARKER_COUNT_INIT, CLUSTER_POSITION_INIT);
            ctx.markerCollection = new MarkerCollection(markers, {
              cluster: false
            });
            ctx.markerCollection.setMap(map);
          });


          itShouldStartClustering();

          describe('toggling with #stopClustering', function() {

            beforeEach(function() {
              ctx.markerCollection.startClustering();
              ctx.markerCollection.stopClustering();
            });


            itShouldStartClustering();

          });

          function itShouldStartClustering() {

            it('should cluster groups of markers', function() {
              ctx.markerCollection.startClustering();

              expect(map).toHaveMarkerCount(0);
              expect(map).toHaveClusterCount(1);
            });

            it('should add new markers to clusters', function() {
              var somwhereElse = CLUSTER_POSITION_INIT.map(function(coord) {
                return coord - 10;
              });
              ctx.markerCollection.startClustering();

              // Add markers next to init markers
              ctx.markerCollection.add(getMarkers(10, CLUSTER_POSITION_INIT));
              expect(map).toHaveMarkerCount(0);
              expect(map).toHaveClusterCount(1);

              // Add markers somewhere else on the map
              ctx.markerCollection.add(getMarkers(10, somwhereElse));
              expect(map).toHaveMarkerCount(0);
              expect(map).toHaveClusterCount(2);
            });

          }

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


    function findClusters(opt_map) {
      var scopeMap = opt_map || map;
      return $(scopeMap.getElement()).find('.' + CLUSTER_CLASS);
    }

    function findMarkers(opt_map) {
      var scopeMap = opt_map || map;
      var selector = 'img[src$="{markerUrl}"]'.
        replace('{markerUrl}', MARKER_URL);

      return $(scopeMap.getElement()).find(selector);
    }


    /**
     * Helper for getting a bunch of markers
     * around the same lat lon.
     *
     * @param count
     * @param {aeris.LatLon=} opt_position Lat lon location around which markers will be centered.
     * @param {Object=} opt_options
     * @param {String=} opt_options.type If specified, will be used to stub the marker's `getType` return value.
     *
     * @return {Array.aeris.markers.Marker}
     */
    function getMarkers(count, opt_position, opt_options) {
      var options = opt_options || {};
      var positions = [];
      var basePos = opt_position || NW;

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
