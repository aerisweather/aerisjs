define([
  'aeris/util',
  'aeris/geolocate/options/geolocateserviceoptions'
], function(_, GeolocateServiceOptions) {
  var root = this;

  /**
   * @class HTML5ServiceOptions
   * @namespace aeris.geolocate.options
   * @extends aeris.geolocate.options.GeolocateServiceOptions
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_options.navigator
  */
  var HTML5ServiceOptions = function(opt_options) {
    var options = _.defaults(opt_options || {}, this.getDefaultOptions());

    this.navigator = options.navigator;

    GeolocateServiceOptions.call(this, options);
  };
  _.inherits(HTML5ServiceOptions, GeolocateServiceOptions);


  /**
   * @method getDefaultOptions
   */
  HTML5ServiceOptions.prototype.getDefaultOptions = function() {
    return _.clone(HTML5ServiceOptions.DEFAULT_OPTIONS);
  };


  /**
   * @override
   */
  HTML5ServiceOptions.DEFAULT_OPTIONS = _.extend({},
    GeolocateServiceOptions.DEFAULT_OPTIONS,
    {
      navigator: root.navigator
    }
  );


  return HTML5ServiceOptions;
});
