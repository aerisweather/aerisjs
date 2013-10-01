define([
  'aeris/util',
  'strategy/layerstrategies/maptype/imagemaptypeeventhub'
], function(_, events) {
  /**
   * Similar to a {google.maps.ImageMapType}
   * but with some additional functionality.
   *
   * See https://developers.google.com/maps/documentation/javascript/reference#ImageMapTypeOptions
   *  for additional parameter options.
   *
   * @class aeris.maps.gmaps.layerstrategies.maptype.ImageMapType
   *
   * @param {Object} options
   * @param {number=} options.zIndex Optional.
   * @param {number=} options.opacity Optional.
   * @param {Function} options.getTileUrl Required.
   * @param {google.maps.Size} options.tileSize Required.
   *
   * @constructor
   */
  var ImageMapType = function(options) {
    options = _.extend({
      zIndex: 1,
      opacity: 1
    }, options);

    _.extend(this, _.pick(options, [
      'alt',
      'maxZoom',
      'minZoom',
      'name',
      'projection',
      'radius',
      'tileSize'
    ]));


    /**
     * See {google.maps.ImageMapType#getTileUrl}
     * @type {Function}
     */
    this.getTileUrl_ = options.getTileUrl;


    /**
     * The options passed in when creating this object.
     *
     * @type {{zIndex: number=, opacity: number=, getTileUrl: Function, tileSize: google.maps.Size}}
     * @private
     */
    this.options_ = options;


    /**
     * @type {Array.<Node>}
     * @private
     */
    this.divs_ = [];


    /**
     * Images created for each tile.
     *
     * @type {Array.<Node>}
     * @private
     */
    this.imgs_ = [];


    /**
     * Loaded image elements.
     * A subset of this.imgs_
     *
     * @type {Array.<Node>}
     * @private
     */
    this.loadedImgs_ = [];


    /**
     * The current zIndex
     * @type {number}
     * @private
     */
    this.zIndex_ = this.options_.zIndex;


    // Update our zIndex
    // whenever any other ImageMapType
    // changes theres.
    // This seems to be necessary for
    // gmaps to save our zIndex state.
    events.on('zIndex:update', function() {
      // Reset our zIndex.
      // Don't trigger the event again,
      // or we'll create an endless loop.
      this.setZIndex(this.zIndex_, { trigger: false });
    }, this);
  };

  ImageMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('div');
    var img = ownerDocument.createElement('img');

    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.opacity = this.options_.opacity;

    this.setZIndex(this.options_.zIndex);

    img.style.width = '100%';
    img.style.height = '100%';
    img.setAttribute('src', this.getTileUrl_(coord, zoom));

    img.onload = _.bind(function() {
      this.addLoadedImage_(img);
    }, this);

    div.appendChild(img);

    // Keep track of the element,
    // so we can manipulate it later.
    this.divs_.push(div);
    this.imgs_.push(img);

    return div;
  };


  ImageMapType.prototype.addLoadedImage_ = function(img) {
    this.loadedImgs_.push(img);
    if (this.imgs_.length === this.loadedImgs_.length) {
      google.maps.event.trigger(this, 'tilesloaded');
    }
  };


  /**
   * Returns the parent node of the
   * entire map type. The siblings of this
   * node are other map types.
   *
   * Note that this method is fragile,
   * as it relies on an undocumented google maps
   * DOM structure. Whenever possible,
   * it's probably better to avoid using this method,
   * and directly interface with this.divs_, instead.
   *
   * @private
   */
  ImageMapType.prototype.getParentNode_ = function() {
    try {
      return this.divs_[0].parentNode.parentNode;
    }
    catch (e) {
      return null;
    }
  };


  ImageMapType.prototype.setZIndex = function(zIndex, opt_options) {
    var options = _.extend({
      trigger: true
    }, opt_options);

    // Save our new zIndex state.
    this.zIndex_ = zIndex;

    if (this.getParentNode_()) {
      this.getParentNode_().style.zIndex = zIndex;
    }

    // Tell everyone that we updated our zIndex,
    // so they can update their too.
    //
    // Otherwise, google seems to overwrite zIndexes.
    if (options.trigger) {
      events.trigger('zIndex:update', this, zIndex);
    }
  };


  ImageMapType.prototype.releaseTile = function(div) {
    this.divs_ = _.without(this.divs_, div);
    this.imgs_ = _.without(this.imgs_, div.getElementsByTagName('img'));
    this.loadedImgs_ = _.without(this.imgs_, div.getElementsByTagName('img'));
  };


  ImageMapType.prototype.setOpacity = function(opacity) {
    _.each(this.divs_, function(div) {
      div.style.opacity = opacity;
    }, this);
  };


  return ImageMapType;
});
