/**
 * @fileoverview Tests the AbstractRouteCommand class, using the MockRouteCommand
 * as a proxy.
 */
define([
  'aeris/util',
  'aeris/maps/routes/commands/abstractroutecommand',
  'aeris/maps/routes/route'
], function(_, AbstractRouteCommand, Route) {
  describe('An AbstractRouteCommand', function() {
    var ConcreteRouteCommand = function(route, opt_isResolving, opt_timeout) {
      AbstractRouteCommand.call(this, route);

      this.isResolving_ = opt_isResolving === undefined ? true : opt_isResolving;
      this.timeout_ = opt_timeout === undefined ? 25 : opt_timeout;

      // -1 --> never executed
      // 0  --> undone
      // 1  --> executed
      this.state_ = -1;
    };
    _.inherits(ConcreteRouteCommand, AbstractRouteCommand);

    ConcreteRouteCommand.prototype.execute_ = function() {
      var promise = new Promise();
      var self = this;

      window.setTimeout(function() {
        if (self.isResolving_) {
          self.state_ = 1;
          promise.resolve();
        }
        else { promise.reject(); }
      }, this.timeout_);

      return promise;
    };

    ConcreteRouteCommand.prototype.undo_ = function() {
      var promise = new Promise();
      var self = this;

      window.setTimeout(function() {
        if (self.isResolving_) {
          self.state_ = 0;
          promise.resolve();
        }
        else { promise.reject(); }
      }, this.timeout_);

      return promise;
    };

    ConcreteRouteCommand.prototype.getState = function() {
      return this.state_;
    };


    it('should require a route', function() {
      expect(function() {
        new ConcreteRouteCommand(null);
      }).toThrowType('InvalidArgumentError');

      new ConcreteRouteCommand(new Route());
    });

  });
});
