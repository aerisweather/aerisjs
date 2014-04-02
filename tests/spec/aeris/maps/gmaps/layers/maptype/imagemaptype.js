define([
  'aeris/util',
  'aeris/maps/strategy/layers/maptype/imagemaptype',
  'jquery'
], function(_, ImageMapType, $) {

  var MockDocument = function() {
  };

  MockDocument.prototype.createElement = function(tagName) {
    if (tagName === 'img') {
      return new MockImageElement();
    }
    else {
      return document.createElement(tagName);
    }
  };


  var MockImageElement = function() {
    this.img_ = document.createElement('img');

    this.stubSrc_();

    return this.img_;
  };

  MockImageElement.prototype.stubSrc_ = function() {
    var getAttribute_orig, setAttribute_orig;
    setAttribute_orig = this.img_.setAttribute;
    getAttribute_orig = this.img_.getAttribute;

    this.img_.setAttribute = _.bind(function(attr, value) {
      if (attr === 'src') {
        this.img_.setSrc_ = value;
      }
      else {
        setAttribute_orig.call(this.img_, attr, value);
      }
    }, this);

    this.img_.getAttribute = _.bind(function(attr) {
      if (attr === 'src') {
        return this.img_.setSrc_;
      }
      else {
        return getAttribute_orig.call(this.img_, attr);
      }
    }, this);
  };




  function createParentNodeForTile(tile) {
    var firstLevelParent = $('<div></div>').append(tile)[0];
    var secondLevelParent = $('<div></div>').append(firstLevelParent)[0];

    return secondLevelParent;
  }





  describe('An ImageMapType', function() {
    var ownerDocument, getTileUrl;
    var OPACITY_STUB, Z_INDEX_STUB, TILE_URL_STUB, COORD_STUB, ZOOM_STUB;

    beforeEach(function() {

      OPACITY_STUB = '0.123';
      Z_INDEX_STUB = '456';
      COORD_STUB = { x: 1, y: 1 };
      ZOOM_STUB = 123;
      TILE_URL_STUB = 'TILE_URL_STUB';

      getTileUrl = jasmine.createSpy('getTileUrl').andReturn(TILE_URL_STUB);
      ownerDocument = new MockDocument();
    });



    describe('constructor', function() {

      it('should set properties for all MapTypeInterface options passed as params', function() {
        var options = {
          alt: _.uniqueId('alt_'),
          minZoom: _.uniqueId('minZoom_'),
          maxZoom: _.uniqueId('maxZoom_'),
          projection: _.uniqueId('projection_'),
          radius: _.uniqueId('radius_'),
          tileSize: _.uniqueId('tileSize_')
        };
        var mapType = new ImageMapType(options);

        expect(mapType.alt).toEqual(options.alt);
        expect(mapType.minZoom).toEqual(options.minZoom);
        expect(mapType.maxZoom).toEqual(options.maxZoom);
        expect(mapType.projection).toEqual(options.projection);
        expect(mapType.radius).toEqual(options.radius);
        expect(mapType.tileSize).toEqual(options.tileSize);
      });

    });


    describe('Event bindings', function() {
      var Z_INDEX_A = 100, Z_INDEX_B = 200, Z_INDEX_C = 300;
      var mapTypeA, mapTypeB, mapTypeC;

      beforeEach(function() {
        mapTypeA = new ImageMapType({
          zIndex: Z_INDEX_A,
          getTileUrl: getTileUrl
        });
        mapTypeB = new ImageMapType({
          zIndex: Z_INDEX_B,
          getTileUrl: getTileUrl
        });
        mapTypeC = new ImageMapType({
          zIndex: Z_INDEX_C,
          getTileUrl: getTileUrl
        });

        spyOn(mapTypeA, 'setZIndex').andCallThrough();
        spyOn(mapTypeB, 'setZIndex').andCallThrough();
        spyOn(mapTypeC, 'setZIndex').andCallThrough();
      });


      it('should reset it\'s zIndex when another ImageMapType retrieves a tile', function() {
        var tileA = mapTypeA.getTile(COORD_STUB, ZOOM_STUB, ownerDocument);
        var tileC = mapTypeC.getTile(COORD_STUB, ZOOM_STUB, ownerDocument);
        var parentA = createParentNodeForTile(tileA);
        var parentC = createParentNodeForTile(tileC);

        // Reset parent zIndex's, mimicking google behavior
        parentA.style.zIndex = 0;
        parentC.style.zIndex = 0;

        mapTypeB.getTile(COORD_STUB, ZOOM_STUB, ownerDocument);

        // Should reset zIndexes to orig values
        expect(parseInt(parentA.style.zIndex)).toEqual(Z_INDEX_A);
        expect(parseInt(parentC.style.zIndex)).toEqual(Z_INDEX_C);
      });

    });


    describe('getTile', function() {
      var mapType;

      beforeEach(function() {
        mapType = new ImageMapType({
          opacity: OPACITY_STUB,
          zIndex: Z_INDEX_STUB,
          getTileUrl: getTileUrl
        });
      });


      // This test should only be used for debugging,
      // as performance results are not consistent enough
      // for a potentially build-breaking test.
      xit('speed test', function() {
        // 10 animation frames on a full-screen map on my
        // mac creates 900 tiles. 100 creates 9000.
        var COUNT = 3000;
        var pSamples = [];
        var pSum;

        _.times(COUNT, function() {
          var p0 = performance.now();
          tile = mapType.getTile(COORD_STUB, ZOOM_STUB, document);
          var p1 = performance.now();

          pSamples.push(p1 - p0);
        });

        pSum = pSamples.reduce(function(sum, val) { return sum + val; }, 0);
        console.log(COUNT + ' tiles in ' + (pSum / 1000).toFixed(2) + ' seconds.');
      });


      describe('the returned tile', function() {
        var tile;

        beforeEach(function() {
          tile = mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument);
        });


        it('should be an HTMLElement', function() {
          expect(_.isElement(tile)).toEqual(true);
        });

        it('should have a specified opacity', function() {
          expect(tile.style.opacity).toEqual(OPACITY_STUB);
        });

        it('should contain an image', function() {
          expect($(tile).find('img').length).toEqual(1);
        });

        describe('the contained image', function() {
          var img;

          beforeEach(function() {
            img = $(tile).find('img')[0];
          });

          it('should request a tile source from the getTileUrl param', function() {
            expect(getTileUrl).toHaveBeenCalledWith(COORD_STUB, ZOOM_STUB);
          });

          it('should have source provided by the getTileUrl ctor param', function() {
            expect(img.getAttribute('src')).toEqual(TILE_URL_STUB);
          });

        });

        describe('if y coordinate is out of range', function() {

          beforeEach(function() {
            COORD_STUB = {
              x: 1,
              y: -1
            };
            tile = mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument);
          });


          it('should be an empty element', function() {
            expect(_.isElement(tile)).toEqual(true);
            expect(tile.children.length).toEqual(0);
          });

        });

      });

      it('should set the zIndex', function() {
        spyOn(mapType, 'setZIndex');
        mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument);

        expect(mapType.setZIndex).toHaveBeenCalled();
      });

    });


    describe('setOpacity', function() {
      var mapType, STARTING_OPACITY;

      beforeEach(function() {
        STARTING_OPACITY = 1.0;
        mapType = new ImageMapType({
          getTileUrl: getTileUrl,
          opacity: STARTING_OPACITY
        });
      });


      it('should change the opacity of all loaded tiles', function() {
        var tiles = [
          mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument),
          mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument),
          mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument)
        ];
        var OPACITY = 0.12345;
        mapType.setOpacity(OPACITY);

        tiles.forEach(function(div) {
          var divOpacity = parseFloat(div.style.opacity);
          expect(divOpacity).toEqual(OPACITY);
        });
      });

      it('should not change the opacity of released tiles', function() {
        var tiles = [
          mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument),
          mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument),
          mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument)
        ];
        var OPACITY_BEFORE_RELEASE = 0.12345;
        var OPACITY_AFTER_RELEASE = 0.98765;
        mapType.setOpacity(OPACITY_BEFORE_RELEASE);

        mapType.releaseTile(tiles[1]);
        mapType.setOpacity(OPACITY_AFTER_RELEASE);

        expect(parseFloat(tiles[1].style.opacity)).toEqual(OPACITY_BEFORE_RELEASE);
      });

    });

    describe('setZIndex', function() {
      var parentNode, tile, mapType;

      beforeEach(function() {
        var firstLevelParent;
        mapType = new ImageMapType({
          getTileUrl: getTileUrl
        });

        tile = mapType.getTile(COORD_STUB, ZOOM_STUB, ownerDocument);
        parentNode = createParentNodeForTile(tile);
      });


      it('should set the zIndex of the tiles\' 2nd level parent element', function() {
        var Z_INDEX = 123456789;

        mapType.setZIndex(Z_INDEX);

        expect(parseFloat(parentNode.style.zIndex)).toEqual(Z_INDEX);
      });

    });

  });

});
