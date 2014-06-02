define([
  'aeris/util',
  'leaflet',
  'jquery',
  './helpers/seededrandom',
  './helpers/normalizetilepoint'
], function(_, L, $, seededRandom, normalizeTilePoint) {
  var CanvasLayer = function(mapObject) {
    this.mapObject_ = mapObject;
    this.urlTemplate_ = mapObject.getUrl().replace('{d}', '{s}');
    this.subdomains_ = mapObject.get('subdomains');

    /**
     *
     *  1234 (timestamp): {
     *      5 (zoomLevel): {
     *        1 (x): {
     *          2 (y): [image object]
     *        }
     *      }
     *    }
     *
     * @type {Object}
     * @private
     */
    this.cache_ = {};

    this.cachedImages_ = [];

    // Proxy the getProgress method for easy access
    this.mapObject_.getProgress = this.getProgress.bind(this);

    L.TileLayer.Canvas.call(this, null, {
      // Improves performance (maybe?) by waiting
      // for panning to finish before loading new tiles.
      updateWhenIdle: true,
      unloadInvisibleTiles: false
    });

    this.on('tileunload', function() {
      // Clean up events bound in draw tile
      this.mapObject_.off('change:time');
    });
  };
  _.inherits(CanvasLayer, L.TileLayer.Canvas);

  CanvasLayer.prototype.drawTile = function(canvas, tilePoint, zoom) {
    tilePoint = normalizeTilePoint(tilePoint, zoom);

    //this.drawTileCoords_(canvas, tilePoint);

    this.drawTileImage_(canvas, tilePoint, zoom, this.mapObject_.getAerisTimeString());

    // Rather than redraw the entire tile HTML object,
    // just redraw the canvas image when the time changes
    //
    // Is there a memory leak here? Does this event stay bound
    // even after canvas is permanently removed (on zoom change)
    this.mapObject_.on('change:time', function() {
      // We may want to only draw images if the layer is visible (set to map, with opacity > 0)
      // otherwise, we could end up preloading more than we want to.
      this.drawTileImage_(canvas, tilePoint, zoom, this.mapObject_.getAerisTimeString());
    }.bind(this));

    this.bindMouseEvents_(canvas);
  };


  /**
   * @method bindMouseEvents_
   * @private
   */
  CanvasLayer.prototype.bindMouseEvents_ = function(canvas) {
    function findPos(obj) {
      var curleft = 0, curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
      }
      return undefined;
    }

    function rgbToHex(r, g, b) {
      if (r > 255 || g > 255 || b > 255)
        throw 'Invalid color component';
      return ((r << 16) | (g << 8) | b).toString(16);
    }

    $(canvas).click(function(e) {
      var canvas = e.currentTarget;
      var ctx = e.currentTarget.getContext('2d');
      var pos = findPos(canvas);
      var x = e.pageX - pos.x;
      var y = e.pageY - pos.y;
      var p = ctx.getImageData(x, y, 1, 1).data;
      this.fireEvent('click:color', { color: p });
    }.bind(this));
  };


  /**
   * @method filterByColor
   */
  CanvasLayer.prototype.filterByColor = function(color) {
    var $canvasTiles = $(this.getContainer()).find('canvas');

    function getEmptyPixel() {
      return [0, 0, 0, 0];
    }
    function isSameColorPixel(pxA, pxB) {
      return pxA.every(function(pxAColor, i) {
        return pxAColor === pxB[i];
      });
    }

    $canvasTiles.each(function() {
      var canvas = $(this)[0];
      var ctx = canvas.getContext('2d');
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);


      var pixelCount = imageData.width * imageData.height;
      var pixels = imageData.data;

      for (var i = 0; i < pixelCount; i++) {
        var isSameColor;
        if (!pixels[i]) { return; }
        isSameColor = isSameColorPixel(pixels[i], color);

        if (!isSameColor) {
          pixels[i][3] = 0;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    });
  };


  // For debug, only
  CanvasLayer.prototype.drawTileCoords_ = function(canvas, tilePoint) {
    var ctx = canvas.getContext('2d');

    ctx.font = '30px Arial';
    ctx.fillText([tilePoint.x, tilePoint.y].join(', '), 100, 100);

    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
  };

  CanvasLayer.prototype.drawTileImage_ = function(canvas, point, zoom, time) {
    var img;
    var ctx = canvas.getContext('2d');
    var cachedImage = this.getFromCache_(point, zoom, time);

    if (cachedImage) {
      // Only redraw canvas if image is loaded
      if (cachedImage.isLoaded) {
        this.clearCanvas_(canvas);
        ctx.drawImage(cachedImage, 0, 0);
      }

      return;
    }


    // No cached image --> create one
    img = new Image();
    // Prevents security errors on canvas.toDataUrl
    img.crossOrigin = 'Anonymous';

    img.isLoaded = false;
    img.onload = function() {
      img.isLoaded = true;

      // Only draw if we're still at the same time
      if (this.mapObject_.getAerisTimeString() === time) {
        this.clearCanvas_(canvas);
        ctx.drawImage(img, 0, 0);
      }
    }.bind(this);

    img.src = this.getImageUrl_(point, zoom, time);
    this.cacheImage_(img, point, zoom, time);
  };

  CanvasLayer.prototype.getImageUrl_ = function(point, zoom, time) {
    return _.template(this.urlTemplate_, {
      s: this.getRandomSubdomain_(),
      z: zoom,
      x: point.x,
      y: point.y,
      t: time
    });
  };

  CanvasLayer.prototype.getRandomSubdomain_ = function() {
    var index = Math.floor(Math.random() * this.subdomains_.length);
    return this.subdomains_[index];
  };


  CanvasLayer.prototype.clearCanvas_ = function(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };


  CanvasLayer.prototype.cacheImage_ = function(img, point, zoom, time) {
    // Prepare object
    this.cache_[zoom] || (this.cache_[zoom] = {});
    this.cache_[zoom][time] || (this.cache_[zoom][time] = {});
    this.cache_[zoom][time][point.x] || (this.cache_[zoom][time][point.x] = {});


    var zoomLevelCache = this.cache_[zoom];
    this.cache_ = {};
    this.cache_[zoom] = zoomLevelCache;

    // Save the image memory.
    // Alternatively, we could save the base64 encoded image
    // using toDataUrl. Using base64 is less memory intensive,
    // but the drawing is more CPU intensive.
    this.cache_[zoom][time][point.x][point.y] = img;

    /*this.cachedImages_.push(img);

     if (this.cachedImages_.length > 1000) {
     this.cachedImages_.shift();
     }*/
  };

  CanvasLayer.prototype.isCached_ = function(point, zoom, time) {
    return !!this.getFromCache_(point, zoom, time);
  };


  CanvasLayer.prototype.getFromCache_ = function(point, zoom, time) {
    return _.path([
      zoom,
      time,
      point.x,
      point.y
    ].join('.'), this.cache_);
  };

  CanvasLayer.prototype.getProgress = function() {
    var loadedImages = this.cachedImages_.filter(function(img) {
      return img.isLoaded;
    });

    return loadedImages.length / this.cachedImages_.length;
  };


  return CanvasLayer;
});
