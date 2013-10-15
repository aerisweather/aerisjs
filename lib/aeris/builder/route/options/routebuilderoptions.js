define([
  'aeris/util',
  'aeris/config',
  'aeris/builder/maps/options/mapappbuilderoptions'
], function(_, config, BaseOptions) {
  /**
   * @typedef {Object} polylineOptions
   * @property {string=} strokeColor
   *                     Stroke color (any valid CSS color).
   *                     Defaults to '#36648b' (Calypso Blue)
   * @property {number=} strokeOpacity
   *                     Stroke opacity (1 is fully opaque).
   *                     Defaults to 0.8.
   * @property {number=} strokeWeight
   *                     Stroke weight, in pixels.
   *                     Defaults to 3.
   */
  /**
   * @typedef {Object} iconOptions
   * @property {string=} url
   *                     Path the the icon image file.
   * @property {number=} width
   *                     Width of the icon, in pixels.
   * @property {number=} height
   *                     Height of the icon, in pixels.
   * @property {Boolean=} clickable
   *                     Whether to allow click events on the icon.
   *                     Defaults to true.
   * @property {Boolean=} draggable
   *                     Whether to allow drag events on the icon.
   *                     Defaults to true.
   */

  /**
   * @typedef {MapAppBuilderOptions} RouteAppBuilderOptions
   *
   *
   * @property {Object=}          routeControls
   *                              Options for UI controls.
   *                              Set to false to remove controls.
   *
   * @property {Boolean=}         routeControls.undo
   *                              Whether to create undo/redo controls.
   *                              Default is true.
   *
   * @property {Array.<string>=}  routeControls.travelModes
   *                              A list of travel modes options
   *                              to use in calculating path directions.
   *                              Defaults to ['WALKING', 'DRIVING', 'BICYCLING'].
   *
   * @property {Boolean=}         routeControls.startingPoint
   *                              Whether to display the lat/lon of
   *                              the first point in a route.
   *                              Defaults to true.
   *
   * @property {Boolean=}         routeControls.distance
   *                              Whether to display the total
   *                              distance of the route.
   *                              Defaults to true.
   *
   * @property {Boolean=}         routeControls.metric
   *                              Whether to display distances
   *                              in metric units.
   *                              Defaults to false (US Standard units).
   *
   *
   * @property {Object=}          route
   *                              Route style options.
   *
   * @property {iconOptions=}     route.waypoint
   *                              Options for styling a waypoint along a route.
   *
   * @property {iconOptions=}     route.selectedWaypoint
   *                              Options for styling a selected waypoint.
   *                              Defaults to options's route.waypoint styles,
   *                              but with a blue icon.
   *
   * @property {polylineOptions=} route.path
   *                              Options for styling a route's path.
   *
   * @property {polylineOptions=} route.offPath
   *                              Options for styling a route's path,
   *                              when the route is not following directions.
   *                              Default's to path style, but with a red stroke.
   */

  /**
   * @constructor
   * @extends {BaseOptions}
   * @class aeris.builder.route.options.RouteBuilderOptions
   *
   * @param {RouteAppBuilderOptions} opt_options
   */
  var RouteBuilderOptions = function(opt_options) {
    BaseOptions.call(this, opt_options);
  };

  _.inherits(RouteBuilderOptions, BaseOptions);


  RouteBuilderOptions.prototype.getDefaultOptions = function() {
    var baseOptions = BaseOptions.prototype.getDefaultOptions.call(this);
    var options = _.extend(baseOptions, {
      route: {
        path: {
          strokeColor: '#36648b',
          strokeOpacity: 0.8,
          strokeWeight: 3
        },
        offPath: {
          strokeColor: '#dd0000'
        },
        waypoint: {
          url: config.get('path') + 'assets/marker_grey.png',
          width: 20,
          height: 20,
          clickable: true,
          draggable: true
        },
        selectedWaypoint: {
          url: config.get('path') + 'assets/marker_yellow.png'
        }
      },
      routeControls: {
        undo: true,
        travelModes: ['WALKING', 'DRIVING', 'BICYCLING'],
        startingPoint: true,
        distance: true,
        metric: false
      }
    });

    // Default offPath to path
    _.extend(options.route.offPath, options.route.path);
    // Default selectedWaypoint to waypoint
    _.extend(options.route.selectedWaypoint, options.route.waypoint);

    return options;
  };

  return RouteBuilderOptions;
});
