define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class WindChill
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var WindChill = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'WindChill',
      tileType: 'current_windchill',
      autoUpdateInterval: AerisTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(WindChill, AerisTile);


  return _.expose(WindChill, 'aeris.maps.layers.WindChill');
});
