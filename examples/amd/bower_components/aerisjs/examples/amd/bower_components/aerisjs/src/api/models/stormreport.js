define([
  'aeris/util',
  'aeris/api/models/pointdata'
], function(_, PointData) {
  /**
   * @publicApi
   * @class StormReport
   * @namespace aeris.api.models
   * @extends aeris.api.models.PointData
   *
   * @constructor
   * @override
   */
  var StormReport = function(opt_attrs, opt_options) {
    PointData.call(this, opt_attrs, opt_options);

    // Update generated 'stormtypes' attr
    // Types are returned as a space-separated list.
    // --> converts to array of types
    this.listenTo(this, {
      'change:report': function() {
        var types = res.report.type.split(' ');
        this.set('stormtypes', types);
      }
    });
  };
  _.inherits(StormReport, PointData);


  /**
   * @method parse
   */
  StormReport.prototype.parse = function(res) {
    var attrs = PointData.prototype.parse.apply(this, arguments);

    attrs.id = res.id;

    // Types are returned as a space-separated list.
    attrs.stormtypes = res.report.type.split(' ');

    return attrs;
  };


  /**
   * @method testFilter
   */
  StormReport.prototype.testFilter = function(filter) {
    return _.contains(this.get('stormtypes'), filter);
  };


  return _.expose(StormReport, 'aeris.api.models.StormReport');
});

/**
 * FYI: Map of codes to storm type.
    {
      'T': 'tornado', // tornado
      'C': 'tornado', // funnel cloud
      'W': 'tornado', // water spout

      'O': 'highwind', // non tstorm wind damage
      'D': 'highwind', // tstorm wind damage
      'N': 'highwind', // high wind speed
      'G': 'highwind', // high wind gust
      'A': 'highwind', // high sustained winds
      'M': 'highwind', // marine thunderstorm winds

      'H': 'hail', // hail

      'E': 'flood', // flood
      'F': 'flood', // flash flood

      'R': 'rain', // heavy rain
      'L': 'lightning', // lightning

      '4': 'highsurf', // tides
      'P': 'highsurf', // rip currents

      '2': 'dust', // dust storm
      'A': 'avalanche', // avalanche
      'U': 'wildfire', // wildfire
      'S': 'snow' // snow
    };
 */
