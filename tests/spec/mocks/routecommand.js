define([
  'aeris',
  'gmaps/route/commands/abstractroutecommand',
  'mocks/waypoint'
], function(aeris, AbstractRouteCommand, MockWaypoint) {
  var RouteCommand = function() {
    AbstractRouteCommand.apply(this, arguments);

    this.mockWaypoint_ = new MockWaypoint();
  };

  aeris.inherits(RouteCommand, AbstractRouteCommand);

  RouteCommand.prototype.execute_ = function() {
    var self = this;

    this.route_.add(this.mockWaypoint_);

    window.setTimeout(function() {
      self.executePromise_.resolve();
    }, 100);
  };

  RouteCommand.prototype.undo_ = function() {
    var self = this;

    this.executePromise_.done(function() {
      this.route_.reset(this.previousRouteState_);

      window.setTimeout(function() {
        self.undoPromise_.resolve();
      }, 100);
    }, this);
  };


  return RouteCommand;
});
