define([
  'ai/util',
  'ai/geolocate/options/geolocateserviceoptions'
], function(_, GeolocateServiceOptions) {
  var root = this;

  /**
   * @class aeris.geolocate.options.HTML5ServiceOptions
   * @extends aeris.geolocate.options.GeolocateServiceOptions
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_options.navigator
  */
  var HTML5ServiceOptions = function(opt_options) {
    GeolocateServiceOptions.call(this, opt_options);
  };
  _.inherits(HTML5ServiceOptions, GeolocateServiceOptions);


  /** @override */
  HTML5ServiceOptions.prototype.getDefaultOptions = function() {
    return _.clone(HTML5ServiceOptions.DEFAULT_OPTIONS);
  };


  /** @override */
  HTML5ServiceOptions.DEFAULT_OPTIONS = _.extend({},
    GeolocateServiceOptions.DEFAULT_OPTIONS,
    {
      navigator: root.navigator
    }
  );


  return HTML5ServiceOptions;
});
