define([
  'aeris/util',
  'aeris/events',
  'aeris/collection',
  'mocks/mockfactory'
], function(_, Events, Collection, MockFactory) {
  var MockRouteBuilder = new MockFactory({
    methods: [
      'setMap',
      'styleRoute',
      'addWaypoint',
      'addWaypointAt',
      'moveWaypoint',
      'getRoute'
    ],
    constructor: function(opt_options) {
      var options = _.defaults(opt_options || {}, {
        route: new Collection()
      });

      this.route_ = options.route;

      Events.call(this);
    }
  });
  _.extend(MockRouteBuilder.prototype, Events.prototype);

  MockRouteBuilder.prototype.getRoute = function() {
    return this.route_;
  };


  return MockRouteBuilder;
});
