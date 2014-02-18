define([
  'aeris/util',
  'sinon',
  'aeris/maps/map',
  'aeris/maps/layers/layer',
  'aeris/promise'
], function(_, sinon, AerisMap, Layer, Promise) {

  function getStubbedMap() {
    return sinon.createStubInstance(AerisMap);
  }

  function getStubbedStrategy() {
    var Strategy = function() {};

    _.each([
      'setMap',
      'remove'
    ], function(method) {
      Strategy.prototype[method] = jasmine.createSpy(method);
    });

    return Strategy;
  }


  function testFactory() {
    var Strategy = getStubbedStrategy();
    var layer = new Layer(null, {
      strategy: Strategy
    });

    return {
      Strategy: Strategy,
      layer: layer
    };
  }


  describe('An Layer', function() {

    describe('constructor', function() {

    });

  });
});
