define([
  'aeris/util',
  'aeris/builder/routes/plugins/travelmode',
  'aeris/maps/routes/waypoint',
  'mocks/aeris/application/plugins/pluginresolver'
], function(_, travelModePlugin, Waypoint, MockPluginResolver) {

  function getTravelModeResolverPlugin() {
    return travelModePlugin().resolvers.travelMode;
  }

  function shouldRejectWithErrorType(resolver, type) {
    var rejectArg;
    expect(resolver.reject).toHaveBeenCalled();

    rejectArg = resolver.reject.mostRecentCall.args[0];
    expect(rejectArg.name).toEqual(type);
  }

  describe('A travelMode WireJS resolver plugin', function() {
    var travelModeResolver, pluginResolver;

    beforeEach(function() {
      travelModeResolver = getTravelModeResolverPlugin();
      pluginResolver = new MockPluginResolver();
    });


    it('should resolve a Waypoint travel mode.', function() {
      _.each([
        'WALKING',
        'DRIVING',
        'BICYCLING'
      ], function(modeToResolve) {
        travelModeResolver(pluginResolver, modeToResolve);
        pluginResolver.shouldHaveResolvedWith(Waypoint.travelMode[modeToResolve]);
      })
    });

    it('should should reject invalid references', function() {
      travelModeResolver(pluginResolver, 'JETSKI');

      pluginResolver.shouldHaveRejectedWithErrorType('InvalidTravelModeError');
    });

  });

});
