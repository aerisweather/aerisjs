define([
  'aeris/util',
  'base/layers/abstracttile'
], function(_, BaseTile) {

  /**
   * Representation of OpenStreetMaps layer.
   *
   * @constructor
   * @class aeris.maps.layers.OSM
   * @extends {aeris.maps.layers.AbstractTile}
   */
  var OSM = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: 'layerstrategies/osm'
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
   * @override
   */
  OSM.prototype.getUrl = function() {
    return this.get('server') + '{z}/{x}/{y}.png';
  };


  return _.expose(OSM, 'aeris.maps.layers.OSM');

});

