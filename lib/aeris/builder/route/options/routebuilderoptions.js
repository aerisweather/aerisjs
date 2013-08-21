define([
  'aeris/util',
  'aeris/builder/options/appbuilderoptions',
  'base/layers/GoogleRoadMap'
], function(_, BaseOptions, GoogleRoadMap) {
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
   * @typedef {AppBuilderConfig} RouteBuilderConfig
   *
   * @property {HTMLElement}      div
   *                              Element where the application
   *                              should be inserted.
   *
   * @property {Object=}          map
   *                              Map options.
   *
   * @property {aeris.maps.layers.GoogleMapType}
   *                              map.baseLayer
   *                              Base layer constructor.
   *                              Defaults to {aeris.maps.layers.GoogleRoadMap}.
   *
   * @property {number=}          map.zoom
   *                              Zoom level of map. Default is 12.
   *
   * @property {Array.<number>=}  map.center
   *                              LatLon coordinates on which to center the map.
   *                              Default is [44.98, -93.2636].
   *
   * @property {Boolean=}         map.scrollZoom
   *                              Whether to allow map zooming
   *                              with the mouse scroll wheel.
   *                              Default is true.
   *
   *
   * @property {Object=}          controls
   *                              Options for UI controls.
   *                              Set to false to remove controls.
   *
   * @property {Boolean=}         controls.undo
   *                              Whether to create undo/redo controls.
   *                              Default is true.
   *
   * @property {Array.<string>=}  controls.travelModes
   *                              A list of travel modes options
   *                              to use in calculating path directions.
   *                              Defaults to ['WALKING', 'DRIVING', 'BICYCLING'].
   *
   * @property {Boolean=}         controls.startingPoint
   *                              Whether to display the lat/lon of
   *                              the first point in a route.
   *                              Defaults to true.
   *
   * @property {Boolean=}         controls.distance
   *                              Whether to display the total
   *                              distance of the route.
   *                              Defaults to true.
   *
   * @property {Boolean=}         controls.metric
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
   *
   * @param {RouteBuilderConfig=} opt_options
   */
  var RouteBuilderOptions = function(opt_options) {
    BaseOptions.call(this, opt_options);
  };

  _.inherits(RouteBuilderOptions, BaseOptions);


  RouteBuilderOptions.prototype.getDefaultOptions = function() {
    var baseOptions = BaseOptions.prototype.getDefaultOptions.call(this);
    var options = _.extend(baseOptions, {
      map: {
        zoom: 12,
        center: [44.98, -93.2636],
        scrollZoom: true,
        baseLayer: GoogleRoadMap
      },
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
          url: _.config.path + 'assets/marker_grey.png',
          width: 20,
          height: 20,
          clickable: true,
          draggable: true
        },
        selectedWaypoint: {
          url: _.config.path + 'assets/marker_yellow.png'
        }
      },
      controls: {
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
