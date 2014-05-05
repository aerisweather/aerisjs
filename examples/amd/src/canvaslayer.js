define([
  'aeris/util',
  'leaflet',
  './helpers/seededrandom',
  './helpers/normalizetilepoint'
], function(_, L, seededRandom, normalizeTilePoint) {
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
    }.bind(this))
  };


  // For debug, only
  CanvasLayer.prototype.drawTileCoords_ = function(canvas, tilePoint) {
    var ctx = canvas.getContext('2d');

    ctx.font = "30px Arial";
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

    /**
     * Really, all were doing here (below) is pre-caching images.
     *
     * Using a delay shuffles to order in which the images
     * are created, so that we don't have to wait for everything to be done
     * before we can play.
     */
    //Using a random seeded by the time keeps tiles in the same
    // "layer set" loaded around the same time.
    // so we don't have various tiles from various times loading together.
    var randomDelay = Math.round(seededRandom(time) * 500);
    _.delay(function() {
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
    }.bind(this), randomDelay);
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
    this.cache_[time] || (this.cache_[time] = {});
    this.cache_[time][zoom] || (this.cache_[time][zoom] = {});
    this.cache_[time][zoom][point.x] || (this.cache_[time][zoom][point.x] = {});


    // Save the image memory.
    // Alternatively, we could save the base64 encoded image
    // using toDataUrl. Using base64 is less memory intensive,
    // but the drawing is more CPU intensive.
    this.cache_[time][zoom][point.x][point.y] = img;

    this.cachedImages_.push(img);
  };

  CanvasLayer.prototype.isCached_ = function(point, zoom, time) {
    return !!this.getFromCache_(point, zoom, time);
  };


  CanvasLayer.prototype.getFromCache_ = function(point, zoom, time) {
    return _.path([
      time,
      zoom,
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
