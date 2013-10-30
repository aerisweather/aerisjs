define([
  'aeris/util',
  'vendor/querystring',
  'vendor/backbone'
], function(_, queryString, Backbone) {
  /**
   * An application router, which syncs itself
   * to a aeris.builder.maps.core.model.State model.
   *
   * @class aeris.builder.maps.core.router.StateRouter
   * @extends Backbone.Router
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
    return queryString.parse(Backbone.history.getHash());
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
      routeStr = queryString.stringify(routeObj);
      this.navigate('' + routeStr);
    }
  };


  /**
   * Event handler for route change.
   *
   * Sets the state to match the route
   * query string parameters.
   *
   * @param {string} frag Route fragment.
   * @private
   */
  StateRouter.prototype.handleRouteChange_ = function(frag) {
    var params = queryString.parse(frag);
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
