define([
  'aeris/util',
  'aeris/util/parseobjectvalues',
  'vendor/querystring',
  'backbone'
], function(_, parseObjectValues, queryString, Backbone) {
  /**
   * An application router, which syncs itself
   * to a aeris.builder.maps.core.models.State model.
   *
   * @class StateRouter
   * @namespace aeris.builder.maps.core.router
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
   * @method updateRoute
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
   * @method handleRouteChange_
   */
  StateRouter.prototype.handleRouteChange_ = function(frag) {
    var params = queryString.parse(frag);
    params = this.processRouteParams_(params);
    this.state_.set(params);
  };


  /**
   * Process the parameters in the route,
   * so they are digestable by the application state.
   *
   * @private
   *
   * @param {Object} params
   * @return {Object}
   * @method processRouteParams_
   */
  StateRouter.prototype.processRouteParams_ = function(params) {
    var stateParams = {};

    // Only include values already registered with the state
    _.each(params, function(value, key) {
      if (this.state_.has(key)) {
        stateParams[key] = value;
      }
    }, this);

    // Convert strings to primitive objects
    // eg. 'true' --> true
    stateParams = parseObjectValues(stateParams);

    return stateParams;
  };


  return StateRouter;
});
