define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'aeris/jsonp',
  'aeris/promise',
  'aeris/events'
], function(_, InvalidArgumentError) {

  /**
   * @fileoverview Facade implementation of the Aeris API.
   */


  _.provide('aeris.AerisAPI');


  /**
   * Facade of the Aeris API.
   *
   * @constructor
   * @class aeris.AerisAPI
   * @extends {aeris.Events}
   */
  aeris.AerisAPI = function() {


    aeris.Events.call(this);


    /**
     * A cache of promises per tile type.
     *
     * @type {Object.<string,aeris.Promise>}
     * @private
     */
    this.timePromises_ = {};


    /**
     * A cache of interval references for tile time updating.
     *
     * @type {Object.<number,number>}
     * @private
     */
    this.tileTimesUpdates_ = {};

  };
  _.extend(aeris.AerisAPI.prototype, aeris.Events.prototype);


  /**
   * Titles for days.
   *
   * @const
   */
  aeris.AerisAPI.dayTitles = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];


  /**
   * Serializes an object into a query string.
   *
   * @static
   * @param {Object} obj Object to serialize.
   * @return {string} Serialized object as query string.
   * @throws Error if `obj` is not an Object
   */
  aeris.AerisAPI.serializeToURI = function(obj) {
    var s = [];
    var add = function(key, value) {
      // If value is a function, invoke it and return its value
      value = _.isFunction(value) ? value() : (value == null ? '' : value);
      s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    };

    // Enforce parameter is object
    if (!_.isObject(obj)) {
      throw new Error('Unable to serialize object to URI: invalid object');
    }

    // If an array was passed in, assume that it is an array of form elements.
    if (_.isArray(obj)) {
      // Serialize the form elements
      for (var i = 0; i < obj.length; i++) {
        add(obj.name, obj.value);
      }
    }
    else {
      for (var prefix in obj) {
        if (obj.hasOwnProperty(prefix)) {
          aeris.AerisAPI.buildParams_(prefix, obj[prefix], add);
        }
      }
    }

    // Return the resulting serialization
    return s.join('&').replace(/%20/g, '+');
  };


  /**
   * Builds a single parameter of a query string,
   * passing the param to the `add` function
   *
   * @static
   * @param {string|Object|Array} prefix
   * @param {string} obj
   * @param {Function} add
   * @private
   */
  aeris.AerisAPI.buildParams_ = function(prefix, obj, add) {
    var name;
    var rbrackets = /\[\]$/;

    if (_.isArray(obj)) {
      // Serialize array item.
      for (var i = 0; i < obj.length; i++) {
        if (rbrackets.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, obj[i]);
        }
        else {
          // Item is non-scalar (array or object), encode its numeric index.
          aeris.AerisAPI.buildParams_(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i], add);
        }
      }

    } else if (_.isObject(obj)) {
      // Serialize object item.
      for (name in obj) {
        aeris.AerisAPI.buildParams_(prefix + '[' + name + ']', obj[name], add);
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj);
    }
  };


  aeris.AerisAPI.serializeBounds = function(bounds) {
    return bounds[0][0] + ',' + bounds[1][1] + ',' + bounds[1][0] + ',' + bounds[0][1];
  };


  /**
   * Get the times for a specific layer.
   *
   * @param {aeris.maps.layer.AerisInteractiveTile} layer The layer to get the times for.
   * @param {boolean=} opt_refresh Optionally force a refresh of the times.
   * @return {aeris.Promise}
   */
  aeris.AerisAPI.prototype.getTileTimes = function(layer, opt_refresh) {
    var refresh = opt_refresh ? true : false;
    var promise = this.timePromises_[layer.tileType];
    if (!promise || refresh) {
      promise = this.timePromises_[layer.tileType] = new aeris.Promise();
      var url = 'http://tile.aerisapi.com/' +
                _.config.apiId + '_' +
                _.config.apiSecret + '/' +
                layer.tileType + '.jsonp';
      aeris.jsonp.get(url, {}, function(data) {
        var times = [];
        var length = data.files.length;
        for (var i = 0; i < length; i++) {
          times.push(data.files[i].time);
        }
        promise.resolve(times);
      }, layer.getTileTimesCallback());
    }
    return promise;
  };


  /**
   * Listen for tile time updates for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to listen for time updates.
   * @param {Function} fn The callback function.
   * @param {Object=} opt_ctx An optional context to call the callback in.
   */
  aeris.AerisAPI.prototype.onTileTimesUpdate = function(layer, fn, opt_ctx) {
    this.on('tileTimesUpdated_' + layer.id, fn, opt_ctx);
    this.startTileTimesUpdate_(layer);
  };


  /**
   * Unsubscribe for tile time updates for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to unsubscribe for time updates.
   * @param {Function=} opt_fn An optional callback function to match.
   * @param {Object=} opt_ctx An option context to match.
   * @return {number} The number of remaining listeners.
   */
  aeris.AerisAPI.prototype.offTileTimesUpdate =
      function(layer, opt_fn, opt_ctx) {
    var count = this.off('tileTimesUpdated_' + layer.id, opt_fn, opt_ctx);
    if (count === 0) {
      window.clearInterval(this.tileTimesUpdates_[layer.id]);
      this.tileTimesUpdates_[layer.id] = null;
    }
    return count;
  };


  /**
   * Start the auto-updating of tile times for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to start the auto-updating.
   * @private
   */
  aeris.AerisAPI.prototype.startTileTimesUpdate_ = function(layer) {
    if (!this.tileTimesUpdates_[layer.id]) {
      var self = this;
      var initTimesPromise = self.getTileTimes(layer);
      initTimesPromise.done(function(times) {
        var currentTime = times[0];
        self.tileTimesUpdates_[layer.id] = window.setInterval(function() {
          var timesPromise = self.getTileTimes(layer, true);
          timesPromise.done(function(times) {
            if (currentTime != times[0]) {
              self.trigger('tileTimesUpdated_' + layer.id, times);
              currentTime = times[0];
            }
          });
        }, layer.autoUpdateInterval);
      });
    }
  };


  /**
   * Return a promise, which resolves with astronomical "Sun/Moon" data
   * (sunrise/sunset), and place data for the specified latLon.
   * @param {Array.<Number>} latLon The target location.
   * @param {Object} opt_globalParams An optional set of "global" params, which are applied to both the
   *  sunmoon endpoint and the places endpoint.
   * @return {aeris.Promise} A promise to return sunmoon and place data.
   *
   * @throws Error if unable to reach API, or API returns error object.
   */
  aeris.AerisAPI.prototype.fetchSunMoon = function(latLon, opt_globalParams) {
    var promise = new aeris.Promise();
    var globalParams = _.extend({
      p: latLon[0] + ',' + latLon[1]
    }, opt_globalParams);

    var endpoints = [
      {
        name: 'places',
        action: 'closest'
      },
      {
        name: 'sunmoon'
      }
    ];

    this.fetchBatch(endpoints, globalParams).done(function(data) {
      var places, sunmoons;

      // Check that data conforms to expectations
      if (
        !data.responses ||
        data.responses.length < 2 ||
        !data.responses[0].response ||
        !data.responses[1].response
      ) {
        promise.reject({
          code: 'unexpected_api_response',
          description: 'The aeris weather API returned a success object, ' +
              'but the content of the response was not in the expected format.'
        });
      }

      places = data.responses[0].response;
      sunmoons = data.responses[1].response;

      // Note: the API may return sunmoon data on a location for which
      // it has no place data. In this case, include the no_data warning object.
      promise.resolve({
        place: places.length ? places[0].place : [],
        profile: places.length ? places[0].profile : [],
        sun: sunmoons[0].sun,
        moon: sunmoons[0].moon,
        error: places.length ? null : data.responses[0].error
      });
    });

    return promise;
  };


  /**
   * Fetch weather data for a location.
   *
   * @param {Array.<number, number>} latLon The latitude and longitude of the
   *                                        location.
   * @param {Object=} opt_globalParams Optional parameters to apply to all endpoints.
   * @return {aeris.Promise}
   */
  aeris.AerisAPI.prototype.fetchWeather = function(latLon, opt_globalParams) {
    var promise = new aeris.Promise();
    var globalParams = _.extend({
      limit: 7,
      p: latLon[0] + ',' + latLon[1]
    }, opt_globalParams);

    var endpoints = [
      {
        name: 'places',
        action: 'closest'
      },
      {
        name: 'observations',
        action: 'closest'
      },
      {
        name: 'forecasts',
        action: 'closest',
        params: {
          limit: globalParams.limit
        }
      }
    ];

    this.fetchBatch(endpoints, globalParams).done(function(data) {
      var forecasts = [];
      for (var i = 0; i < globalParams.limit; i++) {
        var forecast = data.responses[2].response[0].periods[i];
        var forecastTime = new Date(forecast.dateTimeISO);
        forecast.title = aeris.AerisAPI.dayTitles[forecastTime.getDay()];
        forecasts.push(forecast);
      }
      var response = {
        place: data.responses[0].response[0].place,
        observation: data.responses[1].response[0].ob,
        forecasts: forecasts
      };
      promise.resolve(response);
    });

    return promise;
  };


  /**
   * To fetch a single endpoint (just some sugar).
   *
   * @param {string} endpoint Name of the AerisAPI endpoint.
   * @param {string|Object} opt_actionOrParams Name of the action to apply to the endpoint, or a params object.
   * @param {Object} params Parameters to send with the API query.
   * @return {aeris.Promise} Promise object to be resolved when fetch is complete. Will pass a single response
   *  object with data from the API.
   */
  aeris.AerisAPI.prototype.fetch = function(endpoint, opt_actionOrParams, opt_params) {
    var action = null, params;
    var promise = new aeris.Promise();


    // actionOrParams is action (string)
    if (_.isString(opt_actionOrParams)) {
      action = opt_actionOrParams;
      params = opt_params || {};
    }

    // actionOrParams is params
    else if (_.isObject(opt_actionOrParams)) {
      params = opt_actionOrParams;
    }


    // Check for valid endpoint
    if (!_.isString(endpoint)) {
      throw new Error('Invalid argument: endpoint must be a string. Use `fetchBatch` for more options');
    }


    // Delegate to fetchBatch
    this.fetchBatch([{
      name: endpoint,
      action: action,
      params: params
    }]).done(function(res) {
      // Only include the single response object
      // rather than an array of responses for each endpoint
      promise.resolve(res.responses[0]);
    }).fail(function(error) {
      promise.reject(error);
    });

    return promise;
  };


  /**
   * @typedef {Object} AerisAPIEndpoint
   * @property {string} name The name of the endpoint.
   * @property {?action} action An action to use with the endpoint.
   * @property {Object} params Parameters to pass to the endpoint.
   */

  /**
   * Make a batch request to the Aeris API
   *
   * @param {string|Array.<{AerisAPIEndpoint}|string>} endpoints A list of endpoints to use in the batch request.
   *  or a single named enpoint as a string.
   * @param {Object} globalParams Parameters applied to all endpoints.
   * @return {aeris.Promise} Resolves with response data.
   */
  aeris.AerisAPI.prototype.fetchBatch = function(endpoints, globalParams) {
    var promise = new aeris.Promise();
    var requests = [];
    var url = 'http://api.aerisapi.com/batch';
    var defaultParams = {
      client_id: _.config.apiId,
      client_secret: _.config.apiSecret
    };
    var jsonpData = {};

    // Process endpoints as a single string
    if (_.isString(endpoints)) {
      endpoints = [endpoints];
    }

    // Enforce endpoints param type
    if (!_.isArray(endpoints)) {
      throw new Error('Invalid argument: endpoints must be an array of endpoints, or a single named endpoint string');
    }

    // Add endpoints
    for (var i = 0; i < endpoints.length; i++) {
      var epUri;
      var ep = endpoints[i];

      // Normalize endpoint to an object
      if (_.isString(ep)) {
          ep = { name: ep };
      }

      if (!ep.name) {
        throw new Error('Invalid argument: endpoint parameter must define a name property');
      }

      epUri = '/' + ep.name;

      if (ep.action) {
        epUri += '/' + ep.action;
      }

      if (ep.params) {
        epUri += '?' + aeris.AerisAPI.serializeToURI(ep.params);
      }

      requests.push(encodeURIComponent(epUri));
    }

    // Throw error if no endpoints defined
    if (requests.length < 1) {
      throw new Error('Unable to fetch batch API data: no endpoints defined');
    }

    // Add endpoints to jsonpData
    _.extend(jsonpData, { requests: requests.join(',') });

    // Add global params to jsonpData
    _.extend(jsonpData, defaultParams, globalParams);

    // Make ajax request (jsonp)
    aeris.jsonp.get(url, jsonpData, function(data) {
        // Handle API error
        if (data.success !== true) {
          promise.reject(data.error);
        }

        // Search sub-responses for a failed request
        _.each(data.response.responses, function(res) {
          if (res.success !== true) {
            promise.reject(data);
          }
        });


        // Success -> Resolve with response data
        if (promise.getState() === 'pending') {         // Promise hasn't been rejected
          promise.resolve(data.response, {
            request: jsonpData,
            response: data.response,
            uri: url + '?' + aeris.AerisAPI.serializeToURI(jsonpData)
          });
        }
      }
    );

    return promise;
  };


  /**
   * The singleton.
   *
   * @type {aeris.AerisAPI}
   * @private
   */
  aeris.AerisAPI.instance_ = null;


  /**
   * Get the singleton object of an AerisAPI.
   *
   * @return {aeris.AerisAPI}
   */
  aeris.AerisAPI.getInstance = function() {
    if (!aeris.AerisAPI.instance_)
      aeris.AerisAPI.instance_ = new aeris.AerisAPI();
    return aeris.AerisAPI.instance_;
  };


  /**
   * Get the times for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to get the times for.
   * @param {boolean=} opt_refresh Optionally force a refresh of the times.
   * @return {aeris.Promise}
   */
  aeris.AerisAPI.getTileTimes = function(layer, opt_refresh) {
    return aeris.AerisAPI.getInstance().getTileTimes(layer, opt_refresh);
  };


  return aeris.AerisAPI;

});
