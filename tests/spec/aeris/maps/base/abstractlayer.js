define([
  'aeris/util',
  'sinon',
  'base/map',
  'base/abstractlayer',
  'aeris/promise'
], function(_, sinon, AerisMap, AbstractLayer, Promise) {

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
    var layer = new AbstractLayer(null, {
      strategy: Strategy
    });

    return {
      Strategy: Strategy,
      layer: layer
    };
  }


  describe('An AbstractLayer', function() {

    describe('constructor', function() {

    });

  });
});
