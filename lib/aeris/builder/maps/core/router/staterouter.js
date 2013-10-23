define([
  'aeris/util',
  'vendor/backbone',
  'vendor/backbone.queryparams'
], function(_, Backbone) {
  /**
   *
   * @class aeris.builder.maps.core.router.StateRouter
   * @extends Marionette.AppRouter
   *
   * @constructor
   * @override
   */
  var StateRouter = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      routes: {
        '*anyRoute': 'handleRouteChange_'
      }
    });

    this.state_ = options.state;

    Backbone.Router.call(this, options);

    // Update route on state change
    this.listenTo(this.state_, 'change', this.updateRoute);

  };
  _.inherits(StateRouter, Backbone.Router);


  StateRouter.prototype.getQueryParams = function() {
    return Backbone.history.getQueryParameters();
  };


  /**
   * Update the route to match the state.
   */
  StateRouter.prototype.updateRoute = function() {
    var routeObj, routeStr;

    if (Backbone.History.started) {
      // Get the full route string
      routeObj = this.getQueryParams();

      // Add the state to the route
      _.extend(routeObj, this.state_.toJSON());

      // Navigate to the route
      routeStr = this.toFragment('', routeObj);
      this.navigate(routeStr);
    }
  };


  StateRouter.prototype.handleRouteChange_ = function(frag, params) {
    this.setState(params);
  };


  /**
   * Safely set application state, from a give
   * set of route parameters.
   *
   * @param {Object} params
   */
  StateRouter.prototype.setState = function(params) {
    // Only set defined state attributes
    var safeParams = {};
    _.each(params, function(value, key) {
      if (this.state_.has(key)) {
        if (_.isNumeric(value)) {
          value = parseFloat(value);
        }

        safeParams[key] = value;
      }
    }, this);

    this.state_.set(safeParams);
  };


  return StateRouter;
});
