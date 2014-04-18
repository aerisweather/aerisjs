define([
  'aeris/util',
  'aeris/maps/strategy/markers/marker',
  'mocks/aeris/maps/mapobjecttoggle',
  'mocks/google/maps/marker',
  'mocks/google/maps/point'
], function(_, MarkerStrategy, MockMarker, MockGoogleMarker, MockGooglePoint) {

  var MockGmaps = function() {
    return {
      Marker: MockGoogleMarker,
      Point: MockGooglePoint
    };
  };

  describe('A MarkerStrategy', function() {
    var markerStrategy, mockMarker, mockGoogleMarker, markerCtorAttrs;

    beforeEach(function() {
      markerCtorAttrs = {
        url: 'STUB_URL',
        selectedUrl: 'STUB_SELECTED_URL',
        offsetX: 'STUB_OFFSET_X',
        offsetY: 'STUB_OFFSET_Y',
        selectedOffsetX: 'STUB_SELECTED_OFFSET_X',
        selectedOffsetY: 'STUB_SELECTED_OFFSET_Y',
        position: [12345, 98765],
        title: 'STUB_TITLE'
      };

      mockMarker = new MockMarker(markerCtorAttrs);
      markerStrategy = new MarkerStrategy(mockMarker, {
        googlemaps: new MockGmaps()
      });

      mockGoogleMarker = markerStrategy.getView();
    });


    describe('constructor', function() {

      it('should create a google Marker', function() {
        expect(mockGoogleMarker).toBeDefined();
        expect(mockGoogleMarker).toBeInstanceOf(MockGoogleMarker);
      });

      describe('google marker options', function() {

        describe('icon options', function() {

          it('should set the url to the marker url', function() {
            expect(mockGoogleMarker.getIconUrl()).toEqual(markerCtorAttrs.url);
          });

          it('should set the offsetX/Y to the marker offsetX/Y', function() {
            expect(mockGoogleMarker.getIconOffsetX()).toEqual(markerCtorAttrs.offsetX);
          });

          describe('if the marker is selected', function() {

            beforeEach(function() {
              mockMarker.select();
              markerStrategy = new MarkerStrategy(mockMarker, {
                googlemaps: new MockGmaps()
              });
            });


            it('should set the url to the marker selectedUrl, if the marker is selected', function() {
              expect(mockGoogleMarker.getIconUrl()).toEqual(markerCtorAttrs.selectedUrl);
            });

            it('should set the offsetX/Y to the marker selectedOffsetX/Y, if the marker is selected', function() {
              expect(mockGoogleMarker.getIconOffsetX()).toEqual(markerCtorAttrs.selectedOffsetX);
              expect(mockGoogleMarker.getIconOffsetY()).toEqual(markerCtorAttrs.selectedOffsetY);
            });


          });

        });

      });

    });


    describe('ViewModel binding', function() {

      describe('When marker is selected/deselected', function() {

        it('should set the url or selectedUrl accordingly', function() {
          mockMarker.select();
          expect(mockGoogleMarker.getIconUrl()).toEqual(mockMarker.get('selectedUrl'));

          mockMarker.deselect();
          expect(mockGoogleMarker.getIconUrl()).toEqual(mockMarker.get('url'));
        });

        it('should set the offsetX/Y or selectedOffsetX/Y accordingly', function() {
          mockMarker.select();
          expect(mockGoogleMarker.getIconOffsetX()).toEqual(mockMarker.get('selectedOffsetX'));
          expect(mockGoogleMarker.getIconOffsetY()).toEqual(mockMarker.get('selectedOffsetY'));

          mockMarker.deselect();
          expect(mockGoogleMarker.getIconOffsetX()).toEqual(mockMarker.get('offsetX'));
          expect(mockGoogleMarker.getIconOffsetY()).toEqual(mockMarker.get('offsetY'));
        });

      });

      describe('when a marker\'s \'dragabble\' attribute changes', function() {

        beforeEach(function() {
          // set base state
          mockMarker.set('draggable', false);
        });


        it('should update the view\'s draggable attribute', function() {
          mockMarker.set('draggable', true);
          expect(mockGoogleMarker.getDraggable()).toEqual(true);

          mockMarker.set('draggable', false);
          expect(mockGoogleMarker.getDraggable()).toEqual(false);
        });

      });

      describe('when a marker\'s \'clickable\' attribute changes', function() {

        beforeEach(function() {
          // set base state
          mockMarker.set('clickable', false);
        });


        it('should update the view\'s clickable attribute', function() {
          mockMarker.set('clickable', true);
          expect(mockGoogleMarker.getClickable()).toEqual(true);

          mockMarker.set('clickable', false);
          expect(mockGoogleMarker.getClickable()).toEqual(false);
        });

      });

    });


  });

});
