define([
  'aeris/util',
  'mocks/waypoint',
  'aeris/maps/routes/route',
  'jasmine'
], function(_, MockWaypoint, Route) {
  var flag_ = false;

  var spies_ = [];

  afterEach(function() {
    // make sure flags are reset after every test
    flag_ = false;
    spies_.length = 0;
  });

  return {

    setFlag: function() {
      flag_ = true;
    },

    resetFlag: function() {
      flag_ = false;
    },

    checkFlag: function() {
      return flag_;
    },

    /**
     * Add spies to a stored array,
     * which is cleared after every test.
     *
     * @param {...jasmine.Spy} var_args
     */
    addSpies: function(var_args) {
      _.each(arguments, function(spy) {
        spies_.push(spy);
      });
    },


    /**
     * Return all spies added with
     * testUtils#addSpies
     *
     * Note that spies are cleared from memory
     * after every test.
     *
     * Use custom matcher toHaveAllBeenCalled
     * to make sure that all spies were called.
     *
     * eg.:
     *
     *  testUtils.addSpies(
     *    jasmine.createSpy('gottaCallThisOne'),
     *    jasmine.createSpy('andDontForgetThisOneEither');
     *  );
     *
     *  doSomethingThatCallsSpies();
     *
     *  expect(testUtils.getSpies()).toHaveAllBeenCalled();
     *
     * @return {Array.<jasmine.Spy>}
     */
    getSpies: function() {
      return spies_;
    },

    randomFloatBetween: function(minValue, maxValue, precision) {
      precision || (precision = 2);
      return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
    },

    getRandomLatLon: function(from, to) {
      from || (from = [39, -91]);
      to || (to = [41, -89]);

      return [
        this.randomFloatBetween(from[0], to[0]),
        this.randomFloatBetween(from[1], to[1])
      ];
    },

    getRandomPath: function(length) {
      var path = [];
      length || (length = 3);

      _.times(length, function() {
        path.push(this.getRandomLatLon());
      }, this);

      return path;
    },

    getMockWaypoints: function(count) {
      var waypoints = [];

      count || (count = 3);

      // Create the first waypoint (has no path, distance)
      waypoints.push(new MockWaypoint(null, true));

      for (var i = 0; i < (count - 1); i++) {
        waypoints.push(new MockWaypoint());
      }

      return waypoints;
    },

    /**
     * Returns a clone of the specified route.
     * Routes will have different IDs, but
     * can be compared using the toMatchRoute
     * Jasmine matcher.
     *
     * @param {aeris.maps.gmaps.route.Route} route
     * @return {aeris.maps.gmaps.route.Route}
     */
    cloneRoute: function(route) {
      var clone = new Route();
      clone.import(route.export());

      return clone;
    },


    /**
     * Stub out an event binding
     * so that it immediately calls the event
     * handler.
     *
     * @param {Object} obj Owner of the event.
     * @param {string} topic Bound event name.
     * @param {Array} args Arguments to pass to the event handler.
     * @return {jasmine.Spy}
     */
    stubEvent: function(obj, topic, args) {
      var spy = obj.on.isSpy ? obj.on : spyOn(obj, 'on');

      spy.andCallFake(function(event, callback, ctx) {
        if (event === topic) {
          callback.apply(ctx, args);
        }
      });

      return spy;
    }
  };
});
