define(["aeris"], function(aeris) {

  aeris.provide("aeris.maps.MapOptions");

  aeris.maps.MapOptions = function(aerisMap, options) {
    this.aerisMap = aerisMap
    this.map = aerisMap.map;
    this.options = {};

    this.set(options);
  };

  aeris.maps.MapOptions.prototype = {

    /**
     * setBaseLayer(layer)
     */
    setBaseLayer: aeris.notImplemented('MapOptions.setBaseLayer'),


    /**
     * setCenter(center)
     */
    setCenter: aeris.notImplemented('MapOptions.setCenter'),


    /**
     * setZoom(zoom)
     */
    setZoom: aeris.notImplemented('MapOptions.setZoom'),

    ensureCenter_: function(val) {
      if (this.aerisMap) {
        val = this.aerisMap.toLatLon(val);
      }
      return val;
    },

    set: function(options) {

      options = this.ensure(options);
      this.options = aeris.extend(this.options, options);

      for (var opt in options) {
        var method = 'set' + aeris.ucfirst(opt);
        if (this[method])
          this[method](options[opt]);
      }
    },

    ensure: function(options) {
      for (var opt in options) {
        var method = 'ensure' + aeris.ucfirst(opt) + '_';
        if (this[method])
          options[opt] = this[method](options[opt]);
      }

      return options;
    },

  };

  return aeris.maps.MapOptions;
});
