define([
  'aeris/promise',
  'aeris/util',
  'gmaps/utils',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/errors/jsonparseerror',
  'aeris/events'
], function(Promise, _, mapUtils, InvalidArgumentError, JSONParseError) {

  /**
   * @fileoverview Definition of a Waypoint.
   */


  _.provide('aeris.maps.gmaps.route.Waypoint');


  /**
   * Create a new Waypoint
   *
   * @param {Object} opt_options An object of optional default attributes.
   * @class aeris.maps.gmaps.route.Waypoint
   * @constructor
   * @mixes {aeris.Events}
   */
  aeris.maps.gmaps.route.Waypoint = function(opt_options) {

    // Set default options
    var options = _.extend({
      latLon: null,
      geocodedLatLon: null,
      followDirections: true,
      travelMode: 'WALKING',
      path: null,
      distance: 0,
      selected: false
    }, opt_options);

    aeris.Events.apply(this);

    /**
     * Unique client id.
     *
     * @type {string}
     */
    this.cid = _.uniqueId('wp_');


    /**
     * The original latitude and longitude of the waypoint.
     *
     * @type {?Array.<number>}
     */
    this.latLon = options.latLon;


    /**
     * The geocoded latitude and longitude, possibly a result from a routing
     * service.
     *
     * @type {?Array.<number>}
     */
    this.geocodedLatLon = options.geocodedLatLon;


    /**
     * Boolean value representing if the destination to the waypoint follows
     * a path.
     *
     * @type {boolean}
     */
    this.followDirections = options.followDirections;


    /**
     * String representation of the travel mode to take when following a path.
     * e.g. WALKING, BICYCLING, DRIVING
     *
     * @type {string}
     */
    this.travelMode = options.travelMode;


    /**
     * An array of lat/lon the represent the path to get to waypoint.
     *
     * @type {?Array}
     */
    this.path = options.path;


    /**
     * The distance (in meters) from the previous waypoint.
     *
     * @type {number=0}
     * @private
     */
    this.distance_ = options.distance;


    /**
     * An arbitrary flag,
     * which is nonetheless usefully
     * to waypoint views.
     *
     * @type {Boolean}
     */
    this.selected_ = options.selected;
  };

  _.extend(
    aeris.maps.gmaps.route.Waypoint.prototype,
    aeris.Events.prototype
  );


  /**
   * Safely set Waypoint attributes.
   *
   * @param {Object} attrs
   */
  aeris.maps.gmaps.route.Waypoint.prototype.set = function(attrs, opt_options) {
    var illegals = ['cid'];
    var options = _.extend({
      trigger: true
    }, opt_options);
    var changedProps = _.keys(attrs);

    if (!_.isObject(attrs)) {
      throw new InvalidArgumentError('Invalid attributes object');
    }

    for (var prop in attrs) {
      var thisProp;
      if (attrs.hasOwnProperty(prop)) {
        // Map to private properties
        thisProp = this.hasOwnProperty(prop + '_') ? prop + '_' : prop;

        // Check that property exists
        if (_.isUndefined(thisProp)) {
          throw new InvalidArgumentError('Waypoint has no property \'' + prop + '\'');
        }

        // Check that we're allowed to set this property
        else if (illegals.indexOf(prop) !== -1) {
          throw new InvalidArgumentError('Unable to change protected ' + prop + ' property');
        }

        this[thisProp] = attrs[prop];
      }
    }



    if (options.trigger) {
      // Trigger change:property events
      // This needs to be done after all properties are changed
      // So that properties does get implicit precedence
      _.each(changedProps, function(cp) {
        // Trigger 'select'/'deselect' events
        if (cp === 'selected') {
          this.trigger(
            attrs[prop] == true ? 'select' : 'deselect',
            this
          );
        }
        // Trigger change:property event
        else {
          this.trigger('change:' + cp);
        }
      }, this);

      // Trigger a generic 'change' event
      this.trigger('change', {
        properties: changedProps
      });
    }
  };


  /**
   * Returns the waypoint's distance.
   *
   * @return {number}
   */
  aeris.maps.gmaps.route.Waypoint.prototype.getDistance = function() {
    return this.distance_;
  };


  /**
   * Set the 'selected' property to true.
   *
   * @param {Object=} opt_options
   *        Whether to trigger a Waypoint#select event.
   */
  aeris.maps.gmaps.route.Waypoint.prototype.select = function(opt_options) {
    var options = _.extend({ trigger: true }, opt_options);
    this.set({ selected: true }, { trigger: options.trigger });
  };


  /**
   * Set the 'selected' property to false.
   *
   * @param {Object=} opt_options
   *        Whether to trigger a Waypoint#deselect event.
   */
  aeris.maps.gmaps.route.Waypoint.prototype.deselect = function(opt_options) {
    var options = _.extend({ trigger: true }, opt_options);
    this.set({ selected: false }, { trigger: options.trigger });
  };


  /**
   * Toggle the waypoint's 'selected' attribute
   *
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.trigger
   */
  aeris.maps.gmaps.route.Waypoint.prototype.toggleSelect = function(opt_options) {
    var options = _.extend({ trigger: true }, opt_options);
    var fn = this.isSelected() ? this.deselect : this.select;

    fn.call(this, options);
  };


  /**
   * Is the 'selected' property true?
   */
  aeris.maps.gmaps.route.Waypoint.prototype.isSelected = function() {
    return this.selected_;
  };


  /**
   * Get the most accurate latitude/longitude with the suggested following
   * order: 1) geocoded, 2) original.
   *
   * @return {Array.<number>}
   */
  aeris.maps.gmaps.route.Waypoint.prototype.getLatLon = function() {
    return this.geocodedLatLon || this.latLon;
  };


  /**
   * Serialize Waypoint as a JSON object
   *
   * @return {Object} Exported waypoint as JSON object.
   */
  aeris.maps.gmaps.route.Waypoint.prototype.toJSON = function() {
    var path = this.path;
    var latLon;

    if (path && path[0].lat) {
      for (var i = 0, length = path.length; i < length; i++) {
        latLon = path[i];
        path[i] = [latLon.lat(), latLon.lng()];
      }
    }

    return {
      latLon: this.latLon,
      geocodedLatLon: this.geocodedLatLon,
      followDirections: this.followDirections,
      travelMode: this.travelMode,
      path: this.path,
      distance: this.getDistance()
    };
  };


  /**
   * Exports the waypoint as a JSON string
   *
   * @return {string} JSON representation of a waypoint.
   */
  aeris.maps.gmaps.route.Waypoint.prototype.export = function() {
    return JSON.stringify(this);
  };


  /**
   * Import a JSON string as a waypoint.
   * Replaces any existing waypoint data.
   *
   * @param {string} jsonStr JSON representation of a waypoint.
   */
  aeris.maps.gmaps.route.Waypoint.prototype.import = function(jsonStr) {
    var obj;
    try {
      obj = JSON.parse(jsonStr);
    }
    catch (e) {
      if (e instanceof window.SyntaxError) {
        throw new JSONParseError('Invalid JSON string');
      }

      throw e;
    }

    this.reset(obj);
  };


  aeris.maps.gmaps.route.Waypoint.prototype.reset = function(obj) {
    var distance = obj instanceof aeris.maps.gmaps.route.Waypoint ? obj.getDistance() : obj.distance;

    // Check for propery formed waypoint obj
    if (!_.isObject(obj)) {
      throw new InvalidArgumentError('Cannot parse non-object as a route');
    }
    if (!_.isNumber(distance) || !distance < 0) {
      throw new JSONParseError(distance + ' is not a valid waypoint distance');
    }
    if (!obj.latLon || !_.isArray(obj.latLon) || !_.isNumber(obj.latLon[0]) || obj.latLon.length !== 2) {
      throw new JSONParseError(obj.latLon + ' is not a valid latLon');
    }
    if (obj.geocodedLatLon && (!_.isArray(obj.geocodedLatLon) || obj.geocodedLatLon.length !== 2)) {
      throw new JSONParseError(obj.geocodedLatLon + ' is not a valid geocodedLatLon');
    }
    if (obj.path !== null && (
        !_.isArray(obj.path) || obj.path.length < 1 || !_.isArray(obj.path[0]) || obj.path[0].length !== 2
      )
    ) {
      throw new JSONParseError(obj.path + ' is not a valid waypoint path');
    }
    if (!_.isBoolean(obj.followDirections)) {
      throw new JSONParseError(obj.followDirections + ' is not a valid followDirections option');
    }
    if (!_.isString(obj.travelMode)) {
      throw new JSONParseError(obj.travelMode + ' is not a valid travelMode options');
    }

    this.set({
      latLon: obj.latLon,
      geocodedLatLon: obj.geocodedLatLon,
      followDirections: obj.followDirections,
      travelMode: obj.travelMode,
      path: obj.path,
      distance: distance
    }, { trigger: false });

    this.trigger('reset', this);
  };


  return aeris.maps.gmaps.route.Waypoint;

});
