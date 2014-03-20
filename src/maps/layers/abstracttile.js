define([
  'aeris/util',
  'aeris/errors/unimplementedpropertyerror',
  'aeris/errors/validationerror',
  'aeris/maps/layers/animationlayer'
], function(_, UnimplementedPropertyError, ValidationError, BaseLayer) {
  /**
   * Representation of image tile layer. Tile layers are
   * expected to pull in tile images from an API.
   *
   *
   * @constructor
   * @class AbstractTile
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AnimationLayer
   */
  var AbstractTile = function(opt_attrs, opt_options) {
    /**
     * Fires when tile images are loaded.
     *
     * @event load
     */
    /**
     * Firest when tile images must
     * be re-loaded (eg. if the map bounds change)
     *
     * @event load:reset
     */

    var options = _.extend({
      strategy: 'layers/tile',
      validate: true
    }, opt_options);


    var attrs = _.extend({
      /**
       * An array of subdomains to use for load balancing tile requests.
       *
       * @attribute subdomains
       * @type {Array.<string>}
       * @abstract
       */
      subdomains: [],


      /**
       * The name of the tile layer.
       *
       * The value of the name can be anything,
       * though some map views will display this name
       * in layer-select controls.
       *
       * @attribute name
       * @type {string}
       * @abstract
       */
      name: undefined,


      /**
       * The server used for requesting tiles. The server will be interpolated by replacing
       * special variables with calculated values. Special variables should be
       * wrapped with '{' and '}'
       *
       * * {d} - a randomly selected subdomain
       *
       * @attribute server
       * @type {string}
       * @abstract
       */
      server: undefined,


      /**
       * The minimum zoom level provided by the tile renderer.
       *
       * @attribute minZoom
       * @type {number}
       * @default 0
       */
      minZoom: 0,


      /**
       * The maximum zoom level provided by the tile renderer.
       *
       * @attribute maxZoom
       * @type {number}
       * @default 22
       */
      maxZoom: 22,


      /**
       * @attribute opacity
       * @type {number} Between 0 and 1.0
       */
      opacity: 1.0,


      /**
       * @attribute zIndex
       * @type {number}
       */
      zIndex: 1
    }, opt_attrs);

    this.listenTo(this, {
      'load': function() {
        this.loaded_ = true;
      },
      'load:reset': function() {
        this.loaded_ = false;
      }
    });

    BaseLayer.call(this, attrs, options);
  };

  _.inherits(AbstractTile, BaseLayer);


  /**
   * @method validate
   */
  AbstractTile.prototype.validate = function(attrs) {
    if (!_.isString(attrs.name)) {
      return new ValidationError('name', 'not a valid string');
    }
    if (!_.isString(attrs.server)) {
      return new ValidationError('server', 'not a valid string');
    }
    if (
      !_.isNumber(attrs.opacity) ||
        attrs.opacity > 1 ||
        attrs.opacity < 0
    ) {
      return new ValidationError('opacity', 'must be a number between 0 and 1');
    }

    return BaseLayer.prototype.validate.apply(this, arguments);
  };


  /**
   * Returns the url for requesting tiles. The url will be interpolated by replacing
   * special variables with calculated values. Special variables should be
   * wrapped in brackets.
   *
   * * d - a randomly selected subdomain
   * * z - the calculated zoom factor
   * * x - the tile's starting x coordinate
   * * y - the tile's starting y coordinate
   *
   * ex. http://{d}.tileserver.net/{z}/{x}/{y}.png
   *
   * @type {string}
   * @return {string} default url for tile image.
   * @method getUrl
   */
  AbstractTile.prototype.getUrl = _.abstractMethod;


  /**
   * @return {string} A random subdomain for the tile server.
   * @method getRandomSubdomain
   */
  AbstractTile.prototype.getRandomSubdomain = function() {
    var index = Math.floor(Math.random() * this.get('subdomains').length);
    return this.get('subdomains')[index];
  };


  /**
   * Implemented map specific zoom factor calculation.
   *
   * @param {number} zoom the map's current zoom level.
   * @return {number}
   * @method zoomFactor
   */
  AbstractTile.prototype.zoomFactor = function(zoom) {
    return zoom;
  };


  /**
   * Sets the opacity of the tile layer.
   *
   * @param {number} opacity Between 0 and 1.
   * @method setOpacity
   */
  AbstractTile.prototype.setOpacity = function(opacity) {
    this.set('opacity', opacity, { validate: true });
  };


  /**
   * Sets the zIndex of a tile layer.
   *
   * @type {*}
   * @method setZIndex
   */
  AbstractTile.prototype.setZIndex = function(zIndex) {
    this.set('zIndex', zIndex, { validate: true });
  };


  /**
   * @return {Boolean} True, if tile images have finished loading.
   * @method isLoaded
   */
  AbstractTile.prototype.isLoaded = function() {
    return !!this.loaded_;
  };


  return AbstractTile;

});
