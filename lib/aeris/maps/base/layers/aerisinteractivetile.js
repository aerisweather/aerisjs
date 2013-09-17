define([
  'aeris/util',
  'aeris/aerisapi',
  'base/layers/tile'
], function(_, AerisAPI) {

  /**
   * @fileoverview Representation of Aeris Interactive Tile layer.
   */


  /**
   * Representation of Aeris Interactive Tile layer.
   *
   * @constructor
   * @class AerisInteractiveTile
   * @extends {aeris.maps.layers.Tile}
   */
  var AerisInteractiveTile = function() {


    aeris.maps.layers.Tile.call(this);


    /**
     * @override
     */
    this.subdomains = ['1', '2', '3', '4'];


    /**
     * @override
     */
    this.server = 'http://tile{d}.aerisapi.com/';


    /**
     * @override
     */
    this.minZoom = 0;


    /**
     * @override
     */
    this.maxZoom = 27;


    /**
     * Tile's timestamp in YYYYMMDDHHMMSS.
     *
     * @type {string}
     */
    this.time = null;


    /**
     * Interactive tile type.
     *
     * @type {string}
     */
    this.tileType = null;


    /**
     * The tile time index to use for displaying the layer.
     *
     * @type {number}
     */
    this.timeIndex = 0;


    /**
     * The layer's animation step.
     *
     * @type {number}
     */
    this.animationStep = 1;


    /**
     * Update intervals used by the Aeris API
     */
    this.updateIntervals = {
      RADAR: 1000 * 60 * 6,         // every 6 minutes
      CURRENT: 1000 * 60 * 60,      // hourly
      MODIS: 1000 * 60 * 60 * 24,   // daily
      SATELLITE: 1000 * 60 * 30,    // every 30 minutes
      ADVISORIES: 1000 * 60 * 3     // every 3 minutes
    }


    this.strategy.push('AerisInteractiveTile');

  }
  _.inherits(AerisInteractiveTile,
                 aeris.maps.layers.Tile);


  /**
   * Return the name of the jsonp callback
   * For returning timestamp metatdata
   *
   * @returns {string} name of jsonp callback
   */
  aeris.maps.Layer.prototype.getTileTimesCallback = function() {
    return this.tileType + 'Times';
  }


  /**
   * @override
   */
  AerisInteractiveTile.prototype.getUrl = function() {
    return this.server +
        _.config.apiId + '_' +
        _.config.apiSecret +
        '/' + this.tileType +
        '/{z}/{x}/{y}/{t}.png';
  }


  /**
   * @override
   */
  AerisInteractiveTile.prototype.clone = function(properties) {
    var LayerType, cloned;
    LayerType = aeris.maps.layers[this.name];

    if(!LayerType) {
      throw new Error("Unable to clone Layer: Invalid layer");
    }

    cloned = new LayerType();

    if(!(cloned instanceof aeris.maps.Layer)) {
      throw new Error("Unable to clone Layer: layer must be instance of aeris.maps.layers.Layer");
    }

    for (var k in this) {
      if (typeof this[k] != 'function' && k != 'id') {
        cloned[k] = this[k];
      }
    }
    cloned.off();
    _.extend(cloned, properties);

    var map = properties.map || this.getMap();
    if (map)
      cloned.setMap(this.getMap());

    return cloned;
  };

  return _.expose(AerisInteractiveTile, 'aeris.maps.layers.AerisInteractiveTile');

});
