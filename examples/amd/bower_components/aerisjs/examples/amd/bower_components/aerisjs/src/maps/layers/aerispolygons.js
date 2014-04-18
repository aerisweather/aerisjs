define([
  'aeris/util',
  'aeris/promise',
  'aeris/jsonp',
  'aeris/maps/layers/polygons',
  'aeris/maps/strategy/layers/aerispolygons'
], function(_, Promise, JSONP, Polygons, Strategy) {
  /**
   * Representation of Aeris Polygons layer.
   *
   * @constructor
   * @class AerisPolygons
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.Polygons
   * @abstract
   */
  var AerisPolygons = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: Strategy
    }, opt_options);

    var attrs = _.extend({
      /**
       * The Aeris polygon type.
       *
       * @type {string}
       */
      aerisPolygonType: undefined,


      /**
       * An object ob each group's styles.
       *
       * @type {Object}
       * @attribute styles
       */
      styles: {},


      /**
       * The Aeris endpoint for fetching polygon data,
       * where {type} is the Aeris polygon type.
       *s
       * @type {string}
       * @private
       */
      url: 'http://gis.hamweather.net/json/{type}.json'
    }, opt_attrs);


    Polygons.call(this, attrs, options);
  };
  _.inherits(AerisPolygons, Polygons);


  /**
   * Returns the parsed url endpoint
   * for grabbing Aeris polygon data.
   * @return {string}
   * @method getUrl_
   * @private
   */
  AerisPolygons.prototype.getUrl_ = function(opt_options) {
    var options = _.extend({
      decoded: false
    }, opt_options);

    var url = this.get('url').replace(/{type}/, this.get('aerisPolygonType'));

    if (options.decoded) {
      url = url.replace(/\.json/, '_decoded.json');
    }
    return url;
  };


  /**
   * Fetch polygon data from
   * the Aeris API.
   *
   * @return {aeris.Promise} Resolves with response from server.
   * @method fetch
   */
  AerisPolygons.prototype.fetch = function(opt_options) {
    var promise = new Promise();

    JSONP.get(this.getUrl_(opt_options), null, function(data) {
      promise.resolve(data);
    }, 'C');

    return promise;
  };


  return AerisPolygons;

});
