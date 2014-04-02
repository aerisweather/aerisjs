define([
  'aeris/util',
  'aeris/events',
  'aeris/maps/map',
  'mocks/mockfactory',
  'mocks/mapobject'
], function(_, Events, Map, MockFactory, MockMapObject) {
  var mockMethods = [
    'getBounds',
    'getView',
    'setCenter',
    'setZoom',
    'setBaseLayer',
    'fitToBounds'
  ];

  var MockMap = function(el, opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      el: el
    });

    Events.call(this);
    MockMapObject.call(this, attrs, opt_options);

    // Spy on all mock methods
    mockMethods.forEach(function(methodName) {
      spyOn(this, methodName).andCallThrough();
    }, this);
  };
  _.inherits(MockMap, Map);
  _.extend(MockMap.prototype, Events.prototype);
  _.extend(MockMap.prototype, MockMapObject.prototype);

  // Stub out mock methods on MockMap prototype
  mockMethods.forEach(function(methodName) {
    MockMap.prototype[methodName] = function() {};
  });



  MockMap.prototype.geBounds = function() {
    return [['S_BOUND_STUB', 'W_BOUND_STUB'], ['N_BOUND_STUB', 'E_BOUND_STUB']];
  };


  MockMap.prototype.getView = function() {
    return {};
  };


  return MockMap;
});
