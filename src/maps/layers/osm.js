define([
  'aeris/util',
  'aeris/maps/layers/abstracttile',
  'aeris/maps/strategy/layers/osm'
], function(_, BaseTile, OSMStrategy) {

  /**
   * Representation of OpenStreetMaps layer.
   *
   * @constructor
   * @publicApi
   * @class OSM
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AbstractTile
   */
  var OSM = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: OSMStrategy
    }, opt_options);

    var attrs = _.extend({
      name: 'OpenStreetMap',
      subdomains: ['a', 'b', 'c'],
      server: 'http://{d}.tile.openstreetmap.org/',
      maxZoom: 18
    }, opt_attrs);


    BaseTile.call(this, attrs, options);
  };

  _.inherits(OSM, BaseTile);




  /**
   * @method getUrl
   */
  OSM.prototype.getUrl = function() {
    return this.get('server') + '{z}/{x}/{y}.png';
  };


  return _.expose(OSM, 'aeris.maps.layers.OSM');

});

