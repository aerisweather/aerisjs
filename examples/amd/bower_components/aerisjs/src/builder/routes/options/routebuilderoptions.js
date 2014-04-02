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
   * Builder configuration options for the
   * {aeris.builder.routes.RouteAppBuilder}.
   *
   * @class RouteBuilderOptions
   * @namespace aeris.builder.routes.options
   * @extends aeris.builder.maps.options.MapAppBuilderOptions
   *
   * @constructor
   * @override
   * @param {RouteAppBuilderOptions=} opt_attrs
   * @param {Object=} opt_options
   */
  var RouteBuilderOptions = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      defaults: {
        route: {}
      }
    });

    // Set default route options
    options.defaults.route = _.defaults(options.defaults.route, {
      path: {},
      offPath: {},
      waypoint: {},
      selectedWaypoint: {}
    });

    // Set default offPath
    options.defaults.route.offPath = _.defaults(
      options.defaults.route.offPath || {},
      options.defaults.route.path
    );

    // Set default selectedWaypoints
    options.defaults.route.selectedWaypoint = _.defaults(
      options.defaults.route.selectedWaypoint || {},
      options.defaults.route.waypoint
    );

    options.defaults.controls = _.defaults(options.defaults.controls || {}, {
      routes: {}
    });

    BaseOptions.call(this, opt_attrs, options);
  };

  _.inherits(RouteBuilderOptions, BaseOptions);


  return RouteBuilderOptions;
});
